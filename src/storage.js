export function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Failed to read "${key}" from storage:`, error);
        return null;
    }
}

export function setData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to write "${key}" to storage:`, error);
    }
}