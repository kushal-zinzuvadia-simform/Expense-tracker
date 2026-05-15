import { addUser, getActiveUser, getUserNameById, getUsers, setActiveUser } from "../services/userService.js"
import { renderExpenses } from "./expenseList.js";
import { renderUserOptions } from "./form.js";
import { renderSummary } from "./summary.js";
import { showToast } from "./toast.js";

const select = document.getElementById("active-user-select");
const input = document.getElementById("new-user-input");
const addBtn = document.getElementById("add-user-btn");

const profileBtn = document.querySelector(".user-profile button");
const userMenu = document.querySelector(".user-menu");
const userDropdown = document.querySelector(".user-dropdown");
const activeUserName = document.querySelector(".user-name");

export function initUser() {
    renderUserDropdown();
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

    addBtn.addEventListener("click", handleAddUser);
    select.addEventListener("change", handleSwitchUser);
}

function renderUserDropdown() {
    const users = getUsers();
    const activeId = getActiveUser();
    const activeName = getUserNameById(activeId);

    select.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select user";
    select.appendChild(defaultOption);

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;

        if (user.id === activeId) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    if (activeUserName) {
        activeUserName.textContent = activeName;

        if (activeName === "Unknown") {
            activeUserName.textContent = "Register";
        }
    }
}

function handleAddUser() {
    const name = input.value.trim();

    if (!name)
        return;

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
    if (users.some(user => user.name.toLowerCase() === name.toLowerCase())) {
        showToast("User already exists.");
        return;
    }

    addUser(name);
    input.value = "";

    renderUserDropdown();
    renderUserOptions();
}

function handleSwitchUser(e) {
    const userId = e.target.value;

    if (!userId)
        return;

    setActiveUser(userId);
    renderUserDropdown();
    renderExpenses();
    renderSummary();
}
