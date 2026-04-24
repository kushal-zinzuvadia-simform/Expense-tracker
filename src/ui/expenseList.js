import { deleteExpense, getExpenses } from "../services/expenseService.js";

const container = document.querySelector(".expense-items");

let handleEdit = null;

// Accepts a callback to set Edit mode
export function initExpenseList({ onEdit }) {
    handleEdit = onEdit;

    container.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);

        if (e.target.classList.contains("delete-btn")) {
            deleteExpense(id);
            renderExpenses();
        }

        if (e.target.classList.contains("edit-btn")) {
            const expense = getExpenses().find(exp => exp.id === id);
            if (handleEdit) handleEdit(expense);
        }
    });
}

export function renderExpenses() {
    const expenses = getExpenses();
    container.replaceChildren();

    expenses.forEach(exp => {
        const card = createExpenseCard(exp);
        container.appendChild(card);
    });
}

function createExpenseCard(exp) {
    const card = createElement("div", "expense-card");

    const top = createElement("div", "expense-top");
    const amount = createElement("span", "amount", `₹${exp.amount}`);
    const date = createElement("span", "date", exp.date);
    top.append(amount, date);

    const middle = createElement("div", "expense-middle");
    const desc = createElement("p", "description", exp.description);
    const meta = createElement("p", "meta", `Paid by ${exp.paidBy}`);
    middle.append(desc, meta);

    const actions = createElement("div", "expense-actions");
    const editBtn = createElement("button", "edit-btn", "Edit");
    editBtn.dataset.id = exp.id;

    const deleteBtn = createElement("button", "delete-btn", "Delete");
    deleteBtn.dataset.id = exp.id;
    actions.append(editBtn, deleteBtn);

    card.append(top, middle, actions);
    return card;
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (text)
        element.textContent = text;

    return element;
}
