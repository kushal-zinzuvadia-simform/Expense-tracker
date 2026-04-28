import { setEditMode } from "../ui/form.js";
import { initExpenseList } from "../ui/expenseList.js";

export function initUI() {
    initExpenseList({
        onEdit: (expense) => setEditMode(expense),
    });
}