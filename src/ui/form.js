import { addExpense, updateExpense } from "../services/expenseService.js";
import { getUsers } from "../services/userService.js";
import { openModal, closeModal, initModalKeyboardHandlers } from "./modal.js";
import { showToast } from "./toast.js";
import { validateExpenseForm } from "./validation.js";
import { getToday } from "./utils.js";

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
const editSplitContainer = editModal.querySelector(".split-users");

const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const paidBySelect = document.getElementById("paidBy");
const splitContainer = createModal.querySelector(".split-users");

let editingId = null;
let onSaveCallback = null;

function getSelectedUsers(container) {
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    return [...checkboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

function calculateSplit(amount, userIds) {
    const splitAmount = Number((amount / userIds.length).toFixed(2));
    const remainder = Number((amount - splitAmount * userIds.length).toFixed(2));

    return userIds.map((userId, index) => ({
        userId,
        amount: index === userIds.length - 1 ? splitAmount + remainder : splitAmount
    }));
}

export function initForm({ onSave }) {
    onSaveCallback = onSave;

    function blockInvalidAmountKeys(e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    }

    function openCreateModal() {
        dateInput.value = getToday();
        dateInput.max = getToday();
        openModal(createModal, amountInput);
    }

    function closeCreateModal() {
        closeModal(createModal);
        form.reset();
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
        const selectedUsers = getSelectedUsers(splitContainer);

        const amount = Number(amountInput.value);
        const description = descriptionInput.value.trim();
        const paidBy = paidBySelect.value;

        const validation = validateExpenseForm(amount, description, dateInput.value, paidBy, selectedUsers, current);
        if (!validation.valid) {
            showToast(validation.message);
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
        if (onSaveCallback) onSaveCallback();
        closeCreateModal();
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

        const selectedUsers = getSelectedUsers(editSplitContainer);

        const amount = Number(editAmountInput.value);
        const description = editDescriptionInput.value.trim();
        const paidBy = editPaidBySelect.value;

        const validation = validateExpenseForm(amount, description, editDateInput.value, paidBy, selectedUsers, current);
        if (!validation.valid) {
            showToast(validation.message);
            return;
        }

        const split = calculateSplit(amount, selectedUsers);

        const updatedExpense = {
            id: editingId,
            amount,
            description,
            date: editDateInput.value,
            paidBy,
            split
        };

        updateExpense(editingId, updatedExpense);
        if (onSaveCallback) onSaveCallback();
        closeEditModal();
    });

    // Initialize modal keyboard handlers
    initModalKeyboardHandlers([createModal, editModal]);
}

export function setEditMode(expense) {
    editingId = expense.id;

    // Populate edit modal's paidBy and split checkboxes with current users
    populateUserControls(editPaidBySelect, editSplitContainer);

    const selectedIds = expense.split?.map(s => s.userId) || [];

    const checkboxes = editSplitContainer.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(cb => {
        cb.checked = selectedIds.includes(cb.value);
    });

    editAmountInput.value = expense.amount;
    editDescriptionInput.value = expense.description;
    editDateInput.value = expense.date;
    editDateInput.max = getToday();
    editPaidBySelect.value = expense.paidBy;

    openModal(editModal, editAmountInput);
}

function populateUserControls(selectEl, checkboxContainer) {
    const users = getUsers();

    // Populate select dropdown
    selectEl.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select user";
    selectEl.appendChild(defaultOption);

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        selectEl.appendChild(option);
    });

    // Populate checkboxes
    checkboxContainer.replaceChildren();

    users.forEach(user => {
        const label = document.createElement("label");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.value = user.id;

        label.appendChild(checkBox);
        label.append(` ${user.name}`);

        checkboxContainer.appendChild(label);
    });
}

export function renderUserOptions() {
    populateUserControls(paidBySelect, splitContainer);
}
