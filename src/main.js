import { initUI } from "./controllers/uiController.js";
import { initForm } from "./ui/form.js";
import { renderExpenses } from "./ui/expenseList.js";
import { renderSummary } from "./ui/summary.js";
import { initUser } from "./ui/user.js";
import { initToast } from "./ui/toast.js";
import { initSettleUp } from "./ui/settleUp.js";

initUI();
initToast(document.getElementById("toast-container"));
initUser();
initSettleUp();

initForm({
    onSave: () => {
        renderExpenses();
        renderSummary();
    }
});

renderExpenses();
renderSummary();
