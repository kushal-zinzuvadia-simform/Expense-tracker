'use strict'

import { deleteExpense } from "../services/expenseService.js";

const container = document.querySelector(".expense-items");
container.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        deleteExpense(id);
        renderExpenses();
    }
});

export function renderExpenses() { }