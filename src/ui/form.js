import { addExpense } from "../services/expenseService.js";
import { renderExpenses } from "./expenseList.js";

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

        addExpense(expense);
        renderExpenses();

        form.reset();
    });
}