export function openModal(modal, focusElement) {
    modal.classList.add("active");
    focusElement?.focus();
}

export function closeModal(modal) {
    modal.classList.remove("active");
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
