import { addExpense, updateExpense } from "../services/expenseService.js";
import { getUsers } from "../services/userService.js";
import { renderExpenses } from "./expenseList.js";

const form = document.querySelector(".expense-form");
const dateInput = document.querySelector("#date");

const createModal = document.getElementById("create-modal");
const openCreateBtn = document.getElementById("open-create-btn");
const cancelCreateBtn = document.getElementById("cancel-create-btn");

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-expense-form");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const editAmountInput = document.getElementById("edit-amount");
const editDescriptionInput = document.getElementById("edit-description");
const editDateInput = document.getElementById("edit-date");
const editPaidBySelect = document.getElementById("edit-paidBy");

const toastContainer = document.getElementById("toast-container");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const paidBySelect = document.getElementById("paidBy");
const splitContainer = document.querySelector(".split-users");

let editingId = null;

function getSelectedUsers() {
    const checkboxes = getCheckboxes();
    return [...checkboxes]
        .filter(cb => cb.checked)
        .map(cb => Number(cb.value));
}

function calculateSplit(amount, userIds) {
    const splitAmount = amount / userIds.length;

    return userIds.map(userId => ({
        userId,
        amount: Number(splitAmount.toFixed(2))
    }));
}

export function initForm({ onSave }) {

    function blockInvalidAmountKeys(e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    }

    function getToday() {
        return new Date().toISOString().split("T")[0];
    }

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("toast-out");
            toast.addEventListener("animationend", () => toast.remove());
        }, 3000);
    }

    function openModal(modal) {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal(modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }

    function openCreateModal() {
        dateInput.value = getToday();
        dateInput.max = getToday();
        openModal(createModal);
    }

    function closeCreateModal() {
        closeModal(createModal);
        form.reset();
    }

    function openEditModal() {
        openModal(editModal);
    }

    function closeEditModal() {
        closeModal(editModal);
        editingId = null;
        editForm.reset();
    }

    amountInput.addEventListener("keydown", blockInvalidAmountKeys);
    editAmountInput.addEventListener("keydown", blockInvalidAmountKeys);

    // Create modal controls
    openCreateBtn.addEventListener("click", openCreateModal);
    cancelCreateBtn.addEventListener("click", closeCreateModal);

    createModal.addEventListener("click", (e) => {
        if (e.target === createModal) {
            closeCreateModal();
        }
    });

    // Add Expense submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const current = getToday();
        const selectedUsers = getSelectedUsers();

        if (selectedUsers.length < 1) {
            showToast("Select at least one user to split");
            return;
        }

        const amount = Number(amountInput.value);
        const description = descriptionInput.value.trim();
        const paidBy = paidBySelect.value;

        if (!amount || amount <= 0) {
            showToast("Amount must be a positive number.");
            return;
        }

        if (dateInput.value > current) {
            showToast("Future dates are not allowed.");
            return;
        }

        if (!paidBy) {
            showToast("Please select who paid for this expense.");
            return;
        }

        if (description.length < 3) {
            showToast("Description must be at least 3 characters.");
            return;
        }

        if (description.length > 50) {
            showToast("Description must not exceed 50 characters.");
            return;
        }

        const split = calculateSplit(amount, selectedUsers);

        const expense = {
            id: crypto.randomUUID(),
            amount,
            description,
            date: dateInput.value,
            paidBy,
            split
        };

        addExpense(expense);
        onSave();
        closeCreateModal();
        form.reset();
        const checkboxes = splitContainer.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(cb => cb.checked = false);
    });

    // Edit modal controls
    cancelEditBtn.addEventListener("click", closeEditModal);

    editModal.addEventListener("click", (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Update Expense submit
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const current = getToday();

        const amount = Number(editAmountInput.value);
        const description = editDescriptionInput.value.trim();
        const paidBy = editPaidBySelect.value;

        if (!amount || amount <= 0) {
            showToast("Amount must be a positive number.");
            return;
        }

        if (editDateInput.value > current) {
            showToast("Future dates are not allowed.");
            return;
        }

        submitBtn.textContent = "Add Expense";
        dateInput.value = getToday();
    });
}

export function setEditMode(expense) {
    editingId = expense.id;
    const selectedIds = expense.split.map(s => s.userId);

    const checkboxes = getCheckboxes();
    checkboxes.forEach(cb => {
        cb.checked = selectedIds.includes(Number(cb.value));
    });

    editAmountInput.value = expense.amount;
    editDescriptionInput.value = expense.description;
    editDateInput.value = expense.date;
    editDateInput.max = new Date().toISOString().split("T")[0];
    editPaidBySelect.value = expense.paidBy;

    editModal.classList.add("active");
    editModal.setAttribute("aria-hidden", "false");
}

export function renderUserOptions() {
    const users = getUsers();
    paidBySelect.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select user";
    paidBySelect.appendChild(defaultOption);

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        paidBySelect.appendChild(option);
    });

    splitContainer.replaceChildren();

    users.forEach(user => {
        const label = document.createElement("label");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.value = user.id;

        label.appendChild(checkBox);
        label.append(` ${user.name}`);

        splitContainer.appendChild(label);
    });
}

function getCheckboxes() {
    return splitContainer.querySelectorAll("input[type='checkbox']");
}
