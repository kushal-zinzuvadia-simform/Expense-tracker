import { addExpense, updateExpense } from "../services/expenseService.js";
import { getUsers } from "../services/userService.js";

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

const toastContainer = document.getElementById("toast-container");
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
    const splitAmount = amount / userIds.length;

    return userIds.map(userId => ({
        userId,
        amount: Number(splitAmount.toFixed(2))
    }));
}

function validateExpenseForm(amount, description, date, paidBy, selectedUsers, currentDate) {
    if (selectedUsers.length < 1) {
        return { valid: false, message: "Select at least one user to split" };
    }

    if (!amount || amount <= 0) {
        return { valid: false, message: "Amount must be a positive number." };
    }

    if (date > currentDate) {
        return { valid: false, message: "Future dates are not allowed." };
    }

    if (!paidBy) {
        return { valid: false, message: "Please select who paid for this expense." };
    }

    if (description.length < 3) {
        return { valid: false, message: "Description must be at least 3 characters." };
    }

    if (description.length > 50) {
        return { valid: false, message: "Description must not exceed 50 characters." };
    }

    return { valid: true };
}

export function initForm({ onSave }) {
    onSaveCallback = onSave;

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

    // Escape key closes modals
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (editModal.classList.contains("active")) {
                closeEditModal();
            }
            if (createModal.classList.contains("active")) {
                closeCreateModal();
            }
        }
    });
}

export function setEditMode(expense) {
    editingId = expense.id;

    // Populate edit modal's paidBy and split checkboxes with current users
    populateEditModalUsers();

    const selectedIds = expense.split.map(s => s.userId);

    const checkboxes = editSplitContainer.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(cb => {
        cb.checked = selectedIds.includes(cb.value);
    });

    editAmountInput.value = expense.amount;
    editDescriptionInput.value = expense.description;
    editDateInput.value = expense.date;
    editDateInput.max = new Date().toISOString().split("T")[0];
    editPaidBySelect.value = expense.paidBy;

    editModal.classList.add("active");
    editModal.setAttribute("aria-hidden", "false");
}

function populateEditModalUsers() {
    const users = getUsers();

    // Populate edit paidBy dropdown
    editPaidBySelect.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select user";
    editPaidBySelect.appendChild(defaultOption);

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        editPaidBySelect.appendChild(option);
    });

    // Populate edit split checkboxes
    editSplitContainer.replaceChildren();

    users.forEach(user => {
        const label = document.createElement("label");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.value = user.id;

        label.appendChild(checkBox);
        label.append(` ${user.name}`);

        editSplitContainer.appendChild(label);
    });
}

export function renderUserOptions() {
    const users = getUsers();

    // Populate create modal's paidBy dropdown
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

    // Populate create modal's split checkboxes
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
