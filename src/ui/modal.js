export function openModal(modal) {
    modal.classList.add("active");
    document.getElementById("amount").focus();
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
