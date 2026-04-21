import { addExpense, updateExpense } from "../services/expenseService.js";
import { renderExpenses } from "./expenseList.js";

let editingId = null;
const form = document.querySelector(".expense-form");
const dateInput = document.querySelector("#date");
const submitBtn = form.querySelector('button[type="submit"]');
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const paidBySelect = document.getElementById("paidBy");

export function initForm() {

    function getToday() {
        return new Date().toISOString().split("T")[0];
    }

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

        if (editingId) {
            updateExpense(editingId, expense);
            editingId = null;
        } else {
            addExpense(expense);
        }

        renderExpenses();
        form.reset();
        submitBtn.textContent = "Add Expense";
        dateInput.value = getToday();
    });
}

export function setEditMode(expense) {
    editingId = expense.id;

    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;
    dateInput.value = expense.date;
    paidBySelect.value = expense.paidBy;

    submitBtn.textContent = "Update Expense";
}