import { addExpense, updateExpense } from "../services/expenseService.js";

const form = document.querySelector(".expense-form");
const dateInput = document.querySelector("#date");

const modal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-expense-form");
const cancelBtn = document.getElementById("cancel-edit-btn");
const editAmountInput = document.getElementById("edit-amount");
const editDescriptionInput = document.getElementById("edit-description");
const editDateInput = document.getElementById("edit-date");
const editPaidBySelect = document.getElementById("edit-paidBy");
const toastContainer = document.getElementById("toast-container");
const amountInput = document.getElementById("amount");

let editingId = null;

function blockInvalidAmountKeys(e) {
    if (["e", "E", "+", "-"].includes(e.key)) {
        e.preventDefault();
    }
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-out");
        toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
}

function openModal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    editingId = null;
    editForm.reset();
}

export function setEditMode(expense) {
    editingId = expense.id;

    editAmountInput.value = expense.amount;
    editDescriptionInput.value = expense.description;
    editDateInput.value = expense.date;
    editDateInput.max = getToday();
    editPaidBySelect.value = expense.paidBy;

    openModal();
}

// Accepts a callback to render Expenses
export function initForm({ onSave }) {
    const today = getToday();

    if (!dateInput.value) {
        dateInput.value = today;
    }
    dateInput.max = today;

    amountInput.addEventListener("keydown", blockInvalidAmountKeys);
    editAmountInput.addEventListener("keydown", blockInvalidAmountKeys);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const current = getToday();

        const expense = {
            id: Date.now(),
            amount: Number(document.getElementById("amount").value),
            description: document.getElementById("description").value,
            date: dateInput.value,
            paidBy: document.getElementById("paidBy").value
        };

        if (!expense.amount || expense.amount <= 0) {
            showToast("Amount must be a positive number.");
            return;
        }

        if (expense.date > current) {
            showToast("Future dates are not allowed.");
            return;
        }

        if (!expense.paidBy.trim()) {
            showToast("Please select who paid for this expense.");
            return;
        }

        const description = expense.description.trim();

        if (description.length < 3) {
            showToast("Description must be at least 3 characters.");
            return;
        }

        if (description.length > 50) {
            showToast("Description must not exceed 50 characters.");
            return;
        }

        addExpense(expense);
        onSave();
        form.reset();
        dateInput.value = getToday();
    });

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const current = getToday();

        const expense = {
            id: editingId,
            amount: Number(editAmountInput.value),
            description: editDescriptionInput.value,
            date: editDateInput.value,
            paidBy: editPaidBySelect.value
        };

        if (!expense.amount || expense.amount <= 0) {
            showToast("Amount must be a positive number.");
            return;
        }

        if (expense.date > current) {
            showToast("Future dates are not allowed.");
            return;
        }

        if (!expense.paidBy.trim()) {
            showToast("Please select who paid for this expense.");
            return;
        }

        const description = expense.description.trim();

        if (description.length < 3) {
            showToast("Description must be at least 3 characters.");
            return;
        }

        if (description.length > 50) {
            showToast("Description must not exceed 50 characters.");
            return;
        }

        updateExpense(editingId, expense);
        onSave();
        closeModal();
    });

    cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}
