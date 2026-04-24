import { initForm, setEditMode } from "../ui/form.js";
import { initExpenseList, renderExpenses } from "../ui/expenseList.js";

// Pass callbacks to eliminate the circular dependency.
export function initUI() {
    initExpenseList({
        onEdit: (expense) => setEditMode(expense),
    });

    initForm({
        onSave: () => renderExpenses(),
    });

    renderExpenses();
}