import { setData, getData } from "../storage.js";

let expenses = getData("expenses") || [];

export function addExpense(expense) {
    expenses.push(expense);
    setData("expenses", expenses);
}

export function getExpenses() {
    return [...expenses];
}

export function deleteExpense(id) {
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
        expenses.splice(index, 1);
        setData("expenses", expenses);
    }
}

export function updateExpense(id, updatedData) {
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
        expenses[index] = updatedData;
        setData("expenses", expenses);
    }
}
