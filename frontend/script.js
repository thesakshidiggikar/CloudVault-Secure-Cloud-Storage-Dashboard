// IMPORTANT: after deploying FastAPI, replace this URL with your API URL.
const API_BASE_URL = "http://YOUR-BACKEND-IP:8000";

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const fileList = document.getElementById("fileList");
const totalFiles = document.getElementById("totalFiles");
const totalSize = document.getElementById("totalSize");
const statusEl = document.getElementById("status");
const toast = document.getElementById("toast");

uploadBtn.addEventListener("click", () => fileInput.click());
refreshBtn.addEventListener("click", loadFiles);

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;
  await uploadFile(file);
  fileInput.value = "";
});

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

async function uploadFile(file) {
  statusEl.textContent = `Preparing secure upload for ${file.name}…`;
  uploadBtn.disabled = true;

  try {
    const urlResponse = await fetch(
      `${API_BASE_URL}/api/upload-url?filename=${encodeURIComponent(file.name)}&content_type=${encodeURIComponent(file.type || "application/octet-stream")}`
    );

    if (!urlResponse.ok) throw new Error(await urlResponse.text());
    const { upload_url } = await urlResponse.json();

    statusEl.textContent = `Uploading ${file.name} to S3…`;

    const uploadResponse = await fetch(upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream"
      },
      body: file
    });

    if (!uploadResponse.ok) throw new Error("S3 upload failed.");

    statusEl.textContent = "";
    showToast("File uploaded to S3 ✓");
    await loadFiles();
  } catch (error) {
    console.error(error);
    statusEl.textContent = "";
    showToast(`Upload failed: ${error.message}`);
  } finally {
    uploadBtn.disabled = false;
  }
}

async function loadFiles() {
  fileList.innerHTML = '<div class="empty">Loading files…</div>';

  try {
    const response = await fetch(`${API_BASE_URL}/api/files`);
    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const files = data.files || [];

    totalFiles.textContent = files.length;
    totalSize.textContent = formatBytes(files.reduce((sum, f) => sum + (f.size || 0), 0));

    if (!files.length) {
      fileList.innerHTML = '<div class="empty">No files yet. Upload your first file.</div>';
      return;
    }

    fileList.innerHTML = files.map(file => `
      <div class="file-row">
        <div>
          <div class="file-name">${escapeHtml(file.key)}</div>
          <div class="file-meta">${escapeHtml(file.last_modified || "")}</div>
        </div>
        <div class="file-meta size">${formatBytes(file.size)}</div>
        <a class="download" href="${file.download_url}" target="_blank" rel="noopener">Open ↗</a>
      </div>
    `).join("");
  } catch (error) {
    fileList.innerHTML = `<div class="empty">Could not connect to backend.<br><small>${escapeHtml(error.message)}</small></div>`;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

loadFiles();

