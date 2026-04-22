import { setData, getData } from "../storage.js";

let expenses = getData("expenses") || [];
let users = getData("users") || [];
let activeUserId = getData("activeUserId") || null;

export function getUsers() {
    return [...users];
}

export function addUser(name) {
    const user = {
        id: Date.now(),
        name
    };

    users.push(user);
    setData("users", users);

    if (!activeUserId) {
        activeUserId = user.id;
        setData("activeUserId", activeUserId);
    }

    return user;
}

export function setActiveUser(id) {
    activeUserId = id;
    setData("activeUserId", id);
}

export function getActiveUser() {
    return activeUserId;
}

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
