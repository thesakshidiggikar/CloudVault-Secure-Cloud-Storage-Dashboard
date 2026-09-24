# LinkedIn post — CloudVault

🚀 **Project update: CloudVault — AWS S3 Storage Dashboard**

I’ve extended CloudVault from a static dashboard demo into a full-stack learning project with a responsive frontend, a FastAPI backend, and an Amazon S3 upload flow.

✨ **What it does**
- Requests a short-lived presigned upload URL from FastAPI
- Uploads the selected file directly from the browser to S3
- Lists objects stored under the `uploads/` prefix
- Displays file count, total stored size, timestamps, and temporary download links
- Includes a refreshable, responsive dark dashboard

🛠️ **Built with:** HTML, CSS, vanilla JavaScript, Python, FastAPI, boto3, and Amazon S3.

The repository includes local setup, IAM, CORS, and static hosting guidance. The backend still needs an AWS bucket and credentials/IAM role plus a configured API URL before the live flow can run. This is a learning project: authentication and per-user authorization are not implemented yet, so it should not be used for private multi-user files as-is.

🔗 **Source code:** https://github.com/thesakshidiggikar/CloudVault-Secure-Cloud-Storage-Dashboard

Feedback welcome: what would you build next—authentication, upload progress, or storage quotas?

#AWS #AmazonS3 #FastAPI #Python #CloudComputing #CloudStorage #FrontendDevelopment #JavaScript #WebDevelopment #PortfolioProject

## Project image

Use [the CloudVault promotional UI illustration](assets/linkedin-cloudvault-cover.svg). It is a designed preview graphic, not a screenshot of a running AWS deployment.
