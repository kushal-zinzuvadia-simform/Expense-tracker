export function openModal(modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

export function closeModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
}

export function initModalKeyboardHandlers(modals) {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modals.forEach(modal => {
                if (modal.classList.contains("active")) {
                    closeModal(modal);
                }
            });
        }
    });
}
