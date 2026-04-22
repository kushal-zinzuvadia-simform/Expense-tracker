import { addUser, getActiveUser, getUsers, setActiveUser } from "../services/expenseService.js"
import { renderUserOptions } from "./form.js";

const select = document.getElementById("active-user-select");
const input = document.getElementById("new-user-input");
const addBtn = document.getElementById("add-user-btn");

export function initUser() {
    renderUserDropdown();

    addBtn.addEventListener("click", handleAddUser);
    select.addEventListener("change", handleSwitchUser); 
}

function renderUserDropdown() {
    const users = getUsers();
    const activeId = getActiveUser();

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
}

function handleAddUser() {
    const name = input.value.trim();

    if (!name)
        return;

    addUser(name);
    input.value = "";

    renderUserDropdown();
    renderUserOptions()
}

function handleSwitchUser(e) {
    const userId = Number(e.target.value);

    if (!userId)
        return;

    setActiveUser(userId);
    renderUserDropdown();
}

renderUserDropdown();
renderUserOptions();