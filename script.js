const modal = document.getElementById("uploadModal");
const toast = document.getElementById("toast");

function openUpload() {
    modal.classList.add("show");
}

function closeUpload() {
    modal.classList.remove("show");
}

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeUpload();
    }
});


function filesSelected() {

    const input = document.getElementById("fileInput");
    const output = document.getElementById("selectedFiles");

    if (!input.files.length) {
        output.innerHTML = "";
        return;
    }

    let html = "<strong>Selected:</strong><br>";

    for (const file of input.files) {
        html += `${file.name} — ${formatSize(file.size)}<br>`;
    }

    output.innerHTML = html;
}


function formatSize(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}


function simulateUpload() {

    const input = document.getElementById("fileInput");

    if (!input.files.length) {
        showToast("Select a file first.");
        return;
    }

    showToast("☁ Uploading to CloudVault...");

    setTimeout(() => {

        showToast("✓ Upload completed successfully.");

        setTimeout(() => {
            closeUpload();
        }, 1200);

    }, 1800);
}


function showToast(message) {

    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}


function searchFiles() {

    const query =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const files =
        document.querySelectorAll(".file");

    files.forEach(file => {

        const name =
            file.dataset.name;

        if (name.includes(query)) {
            file.style.display = "grid";
        } else {
            file.style.display = "none";
        }

    });
}


function sortFiles() {

    const list =
        document.getElementById("fileList");

    const files =
        [...list.querySelectorAll(".file")];

    files.reverse();

    files.forEach(file => {
        list.appendChild(file);
    });

    showToast("Files sorted.");
}


function showUpgrade() {

    showToast(
        "🚀 Upgrade options coming soon."
    );
}
