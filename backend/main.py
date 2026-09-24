import os
from datetime import datetime, timezone
from urllib.parse import quote

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
S3_BUCKET = os.getenv("S3_BUCKET")

if not S3_BUCKET:
    raise RuntimeError("S3_BUCKET is missing in .env")

s3 = boto3.client("s3", region_name=AWS_REGION)

app = FastAPI(title="CloudVault S3 API", version="1.0.0")

# During learning you can use "*" for the S3-hosted frontend.
# For production, replace "*" with your exact frontend origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "cloudvault-s3-api"}

@app.get("/api/upload-url")
def create_upload_url(
    filename: str = Query(min_length=1, max_length=180),
    content_type: str = Query(default="application/octet-stream"),
):
    safe_name = os.path.basename(filename).replace("\\", "_")
    key = f"uploads/{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{safe_name}"

    try:
        url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": S3_BUCKET,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=600,
        )
        return {"upload_url": url, "key": key}
    except ClientError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.get("/api/files")
def list_files():
    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix="uploads/")
        files = []

        for obj in response.get("Contents", []):
            key = obj["Key"]
            if key.endswith("/"):
                continue

            download_url = s3.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": S3_BUCKET, "Key": key},
                ExpiresIn=600,
            )

            modified = obj["LastModified"].astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
            files.append({
                "key": key,
                "size": obj["Size"],
                "last_modified": modified,
                "download_url": download_url,
            })

        files.sort(key=lambda x: x["last_modified"], reverse=True)
        return {"files": files}
    except ClientError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

