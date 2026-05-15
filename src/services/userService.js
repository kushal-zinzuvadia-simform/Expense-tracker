import { getData, setData } from "../storage.js";

let users = getData("users") || [];
let activeUserId = getData("activeUserId") || null;

export function getUsers() {
    return [...users];
}

export function getActiveUsers() {
    return users.filter(user => !user.deleted);
}

export function getUserNameById(id) {
    const user = users.find(user => user.id === id);
    if (!user) return "Unknown";
    return user.deleted ? user.name + " (deleted)" : user.name;
}

export function addUser(name) {
    const user = {
        id: crypto.randomUUID(),
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

export function isUserDeleted(id) {
    const user = users.find(u => u.id === id);
    return user ? !!user.deleted : false;
}

export function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        user.deleted = true;
        setData("users", users);
    }

    if (activeUserId === id) {
        const next = users.find(u => !u.deleted);
        activeUserId = next ? next.id : null;
        setData("activeUserId", activeUserId);
    }
}
