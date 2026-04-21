export function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}