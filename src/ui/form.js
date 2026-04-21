import { addExpense, updateExpense } from "../services/expenseService.js";
import { renderExpenses } from "./expenseList.js";

let editingId = null;
const form = document.querySelector(".expense-form");

export function initForm() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const expense = {
            id: Date.now(),
            amount: Number(document.getElementById("amount").value),
            description: document.getElementById("description").value,
            date: document.getElementById("date").value,
            paidBy: document.getElementById("paidBy").value
        };

        if (editingId) {
            updateExpense(editingId, expense);
            editingId = null;
        } else {
            addExpense(expense);
        }

        renderExpenses();
        form.reset();
        form.querySelector('button[type="submit"]').textContent = "Add Expense";
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