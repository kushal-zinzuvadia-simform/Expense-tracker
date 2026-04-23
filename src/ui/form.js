import { addExpense, updateExpense } from "../services/expenseService.js";
import { renderExpenses } from "./expenseList.js";

const form = document.querySelector(".expense-form");
const dateInput = document.querySelector("#date");

const modal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-expense-form");
const cancelBtn = document.getElementById("cancel-edit-btn");
const editAmountInput = document.getElementById("edit-amount");
const editDescriptionInput = document.getElementById("edit-description");
const editDateInput = document.getElementById("edit-date");
const editPaidBySelect = document.getElementById("edit-paidBy");

let editingId = null;

function getToday() {
    return new Date().toISOString().split("T")[0];
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

export function initForm() {
    const today = getToday();

    if (!dateInput.value) {
        dateInput.value = today;
    }
    dateInput.max = today;

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

        if (expense.date > current) {
            alert("Future dates are not allowed.");
            return;
        }

        const description = expense.description.trim();

        if (description.length < 3) {
            alert("Description must be at least 3 characters");
            return;
        }

        if (description.length > 50) {
            alert("Description exceed 50 characters");
            return;
        }

        addExpense(expense);
        renderExpenses();
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

        if (expense.date > current) {
            alert("Future dates are not allowed.");
            return;
        }

        const description = expense.description.trim();

        if (description.length < 3) {
            alert("Description must be at least 3 characters");
            return;
        }

        if (description.length > 50) {
            alert("Description exceed 50 characters");
            return;
        }

        updateExpense(editingId, expense);
        renderExpenses();
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