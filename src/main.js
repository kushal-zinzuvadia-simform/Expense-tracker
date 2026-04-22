import { initUI } from "./controllers/uiController.js";

import { initForm } from "./ui/form.js";
import { renderExpenses } from "./ui/expenseList.js";
import { renderSummary } from "./ui/summary.js";
import { initUser } from "./ui/user.js";

initUI();

initUser();
initForm({ onSave: () => {
    renderExpenses();
    renderSummary();
} });
renderExpenses();
renderSummary();
