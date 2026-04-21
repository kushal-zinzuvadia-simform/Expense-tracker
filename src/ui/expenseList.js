'use strict'

import { deleteExpense, getExpenses } from "../services/expenseService.js";

const container = document.querySelector(".expense-items");
container.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        deleteExpense(id);
        renderExpenses();
    }
});

export function renderExpenses() {
    const expenses = getExpenses();
    container.replaceChildren();

    expenses.forEach(exp => {
        const card = createExpenseCard(exp);
        container.appendChild(card);
    });
}

function createExpenseCard(exp) {
    const card = el("div", "expense-card");

    const top = el("div", "expense-top");
    const amount = el("span", "amount", `₹${exp.amount}`);
    const date = el("span", "date", exp.date);
    top.append(amount, date);

    const middle = el("div", "expense-middle");
    const desc = el("p", "description", exp.description);
    const meta = el("p", "meta", `Paid by ${exp.paidBy}`);
    middle.append(desc, meta);

    const actions = el("div", "expense-actions");
    const editBtn = el("button", "edit-btn", "Edit");
    editBtn.dataset.id = exp.id;

    const deleteBtn = el("button", "delete-btn", "Delete");
    deleteBtn.dataset.id = exp.id;
    actions.append(editBtn, deleteBtn);

    card.append(top, middle, actions);
    return card;
}

function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (text)
        element.textContent = text;

    return element;
}