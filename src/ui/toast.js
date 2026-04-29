let toastContainer = null;

export function initToast(container) {
    toastContainer = container;
}

export function showToast(message) {
    if (!toastContainer) {
        console.warn("Toast container not initialized. Call initToast() first.");
        return;
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-out");
        toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
}
