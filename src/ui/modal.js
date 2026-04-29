export function openModal(modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    modal.hidden = false;
    document.getElementById("amount").focus();
}

export function closeModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
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
