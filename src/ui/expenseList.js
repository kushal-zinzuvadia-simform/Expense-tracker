import { deleteExpense, getExpenses } from "../services/expenseService.js";
import { getUserNameById, getActiveUser } from "../services/userService.js";
import { renderSummary } from "./summary.js";

const container = document.querySelector(".expense-items");
const emptyState = document.getElementById("empty-state");

let handleEdit = null;

// Accepts a callback to set Edit mode
export function initExpenseList({ onEdit }) {
    handleEdit = onEdit;

    container.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = btn.dataset.id;

        if (btn.classList.contains("delete-btn")) {
            deleteExpense(id);
            renderExpenses();
            renderSummary();
        }

        if (btn.classList.contains("edit-btn")) {
            const expense = getExpenses().find(exp => exp.id === id);
            if (handleEdit && expense) handleEdit(expense);
        }
    });
}

export function renderExpenses() {
    const expenses = getExpenses();
    const activeUserId = getActiveUser();

    // Filter expenses where active user is involved
    const filteredExpenses = activeUserId ? expenses.filter(exp =>
        exp.paidBy === activeUserId || exp.split?.some(s => s.userId === activeUserId)
    ) : expenses;

    container.replaceChildren();

    if (filteredExpenses.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }

    filteredExpenses.forEach(exp => {
        const card = createExpenseCard(exp);
        container.appendChild(card);
    });
}

function createExpenseCard(exp) {
    const card = createElement("div", "expense-card");

    if (exp.isSettlement) {
        card.classList.add("expense-card--settlement");

        const top = createElement("div", "expense-top");
        const amount = createElement("span", "amount", `₹${exp.amount}`);
        const date = createElement("span", "date", exp.date);
        top.append(amount, date);

        const middle = createElement("div", "expense-middle");
        const fromName = getUserNameById(exp.settlementMeta.from);
        const toName = getUserNameById(exp.settlementMeta.to);
        const activeUserId = getActiveUser();
        const fromLabel = exp.settlementMeta.from === activeUserId ? "You" : fromName;
        const toLabel = exp.settlementMeta.to === activeUserId ? "You" : toName;

        const flow = createElement("p", "meta", `${fromLabel} paid ${toLabel}`);
        middle.append(flow);

        const actions = createElement("div", "expense-actions");
        const deleteBtn = createElement("button", "delete-btn", "Delete");
        deleteBtn.dataset.id = exp.id;
        actions.append(deleteBtn);

        card.append(top, middle, actions);
        return card;
    }

    const top = createElement("div", "expense-top");
    const amount = createElement("span", "amount", `₹${exp.amount}`);
    const date = createElement("span", "date", exp.date);
    top.append(amount, date);

    const middle = createElement("div", "expense-middle");
    const desc = createElement("p", "description", exp.description);
    const paidBy = createElement("p", "meta", `Paid by ${getUserNameById(exp.paidBy)}`);
    const splitWith = createElement("p", "meta", "Split with " + getSplitNames(exp.split));
    middle.append(desc, paidBy, splitWith);

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

function getSplitNames(splitData) {
    if (!Array.isArray(splitData)) return "";

    const names = [];
    splitData.forEach(split => {
        names.push(getUserNameById(split.userId));
    });

    return names.join(", ");
}
