import { getData } from "../storage.js";

let users = getData("users") || [];
let activeUserId = getData("activeUserId") || null;

export function getUsers() {
    return [...users];
}

export function getUserNameById(id) {
    const users = getUsers();
    const user = users.find(user => { user.id === id });
    return user ? user.name : id;
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