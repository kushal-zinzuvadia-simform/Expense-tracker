import { addUser, deleteUser, getActiveUser, getActiveUsers, getUserNameById, getUsers, setActiveUser } from "../services/userService.js"
import { calculateBalances } from "../services/balanceService.js";
import { getExpenses } from "../services/expenseService.js";
import { renderExpenses } from "./expenseList.js";
import { renderUserOptions } from "./form.js";
import { renderSummary } from "./summary.js";
import { showToast } from "./toast.js";

const input = document.getElementById("new-user-input");
const addBtn = document.getElementById("add-user-btn");

const profileBtn = document.querySelector(".user-profile button");
const userMenu = document.querySelector(".user-menu");
const userDropdown = document.querySelector(".user-dropdown");
const activeUserName = document.querySelector(".user-name");

const userListToggle = document.getElementById("user-list-toggle");
const userListContainer = document.getElementById("user-list-container");
const userListChevron = document.getElementById("user-list-chevron");

let listExpanded = false;
let collapseTimerId = null;

export function initUser() {
    renderActiveUserName();
    renderUserList();
    renderUserOptions();

    profileBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu?.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!userDropdown?.contains(e.target)) {
            userMenu?.classList.remove("active");
        }
    });

    userListToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        clearTimeout(collapseTimerId);
        listExpanded = !listExpanded;

        if (listExpanded) {
            userListContainer.classList.remove("user-list-collapsing");
            userListContainer.classList.remove("user-list-collapsed");
        } else {
            userListContainer.classList.add("user-list-collapsing");
            collapseTimerId = setTimeout(() => {
                userListContainer.classList.remove("user-list-collapsing");
                userListContainer.classList.add("user-list-collapsed");
            }, 200);
        }

        userListChevron.textContent = listExpanded ? "▴" : "▾";
    });

    addBtn.addEventListener("click", handleAddUser);
}

function renderActiveUserName() {
    const activeId = getActiveUser();
    const activeName = getUserNameById(activeId);

    if (activeUserName) {
        activeUserName.textContent = activeName === "Unknown" ? "Register" : activeName;
    }
}

function renderUserList() {
    userListContainer.replaceChildren();

    const users = getActiveUsers();
    const activeId = getActiveUser();

    if (users.length === 0) {
        const empty = document.createElement("p");
        empty.className = "user-list-empty";
        empty.textContent = "No users yet.";
        userListContainer.appendChild(empty);
        return;
    }

    users.forEach(user => {
        const row = document.createElement("div");
        row.className = "user-list-row" + (user.id === activeId ? " user-list-row--active" : "");

        const name = document.createElement("span");
        name.className = "user-list-name";
        name.textContent = user.name;

        name.addEventListener("click", (e) => {
            e.stopPropagation();
            handleSwitchUser(user.id);
        });

        const delBtn = document.createElement("button");
        delBtn.className = "user-delete-btn";
        delBtn.title = "Delete " + user.name;
        delBtn.textContent = "✕";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleDeleteUser(user.id, user.name);
        });

        row.append(name, delBtn);
        userListContainer.appendChild(row);
    });
}

function handleSwitchUser(userId) {
    setActiveUser(userId);
    userMenu?.classList.remove("active");
    renderActiveUserName();
    renderUserList();
    renderExpenses();
    renderSummary();
}

function handleDeleteUser(userId, userName) {
    const expenses = getExpenses();
    const balances = calculateBalances(expenses);

    const userOwes = balances[userId] || {};
    const hasOwes = Object.values(userOwes).some(amt => amt > 0);

    const othersOwe = Object.entries(balances).some(([borrower, lenders]) => {
        if (borrower === userId) return false;
        return Object.entries(lenders).some(([lender, amt]) => lender === userId && amt > 0);
    });

    if (hasOwes || othersOwe) {
        showToast("Cannot delete \"" + userName + "\". Please settle all balances first.");
        return;
    }

    deleteUser(userId);
    renderActiveUserName();
    renderUserList();
    renderUserOptions();
    renderExpenses();
    renderSummary();
    showToast("\"" + userName + "\" has been removed.", "success");
}

function handleAddUser() {
    const name = input.value.trim();

    if (!name) return;

    if (name.length < 2 || name.length > 20) {
        showToast("User name must be between 2 and 20 characters.");
        return;
    }

    const validNamePattern = /[a-zA-Z]/;
    if (!validNamePattern.test(name)) {
        showToast("Enter valid User name.");
        return;
    }

    const users = getUsers();
    if (users.some(user => !user.deleted && user.name.toLowerCase() === name.toLowerCase())) {
        showToast("User already exists.");
        return;
    }

    addUser(name);
    input.value = "";

    renderActiveUserName();
    renderUserList();
    renderUserOptions();
}
