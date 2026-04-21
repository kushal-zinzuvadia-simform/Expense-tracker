import { addExpense, updateExpense } from "../services/expenseService.js";
import { renderExpenses } from "./expenseList.js";

let editingId = null;
const form = document.querySelector(".expense-form");

export function initForm() {
    const dateInput = document.querySelector("#date");

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
            date: document.getElementById("date").value,
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
        form.querySelector('button[type="submit"]').textContent = "Add Expense";
        dateInput.value = getToday();
    });
}

export function setEditMode(expense) {
    editingId = expense.id;

    document.getElementById("amount").value = expense.amount;
    document.getElementById("description").value = expense.description;
    document.getElementById("date").value = expense.date;
    document.getElementById("paidBy").value = expense.paidBy;

    form.querySelector('button[type="submit"]').textContent = "Update Expense";
}