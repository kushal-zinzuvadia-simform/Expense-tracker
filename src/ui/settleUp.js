import { addSettlementExpense } from "../services/expenseService.js";
import { getActiveUser, getUserNameById } from "../services/userService.js";
import { openModal, closeModal } from "./modal.js";
import { showToast } from "./toast.js";
import { getToday } from "./utils.js";
import { renderExpenses } from "./expenseList.js";
import { renderSummary } from "./summary.js";

const settleModal = document.getElementById("settle-modal");
const settleForm = document.getElementById("settle-form");
const settleAmountInput = document.getElementById("settle-amount");
const cancelSettleBtn = document.getElementById("cancel-settle-btn");
const settleDirection = document.getElementById("settle-direction");

// State for current settle session
let settleState = null;

export function initSettleUp() {
    cancelSettleBtn.addEventListener("click", closeSettleModal);

    settleModal.addEventListener("click", (e) => {
        if (e.target === settleModal) closeSettleModal();
    });

    settleForm.addEventListener("submit", handleSettle);
}

export function openSettleModal(otherUserId, balance) {
    const activeUserId = getActiveUser();
    const activeName = getUserNameById(activeUserId);
    const otherName = getUserNameById(otherUserId);

    const absBalance = Math.abs(balance);

    // who pays whom
    let fromUserId, toUserId, fromName, toName;
    if (balance > 0) {
        // Active user owes otherUser
        fromUserId = activeUserId;
        toUserId = otherUserId;
        fromName = "You";
        toName = otherName;
    } else {
        // otherUser owes active user
        fromUserId = otherUserId;
        toUserId = activeUserId;
        fromName = otherName;
        toName = "You";
    }

    settleState = { fromUserId, toUserId, fromName, toName, otherUserId };

    const flow = document.createElement("div");
    flow.className = "settle-flow";

    const fromSpan = document.createElement("span");
    fromSpan.className = "settle-user settle-from";
    fromSpan.textContent = fromName;

    const arrowSpan = document.createElement("span");
    arrowSpan.className = "settle-arrow";
    arrowSpan.textContent = "→";

    const toSpan = document.createElement("span");
    toSpan.className = "settle-user settle-to";
    toSpan.textContent = toName;

    flow.append(fromSpan, arrowSpan, toSpan);
    settleDirection.replaceChildren(flow);

    settleAmountInput.value = absBalance.toFixed(2);
    settleAmountInput.max = "";

    openModal(settleModal, settleAmountInput);
}

function closeSettleModal() {
    closeModal(settleModal);
    settleForm.reset();
    settleState = null;
}

function handleSettle(e) {
    e.preventDefault();
    if (!settleState) return;

    const amount = Number(settleAmountInput.value);
    if (!amount || amount <= 0) {
        showToast("Please enter a valid amount.");
        return;
    }

    const { fromUserId, toUserId } = settleState;

    addSettlementExpense({
        fromUserId,
        toUserId,
        amount,
        date: getToday()
    });

    renderExpenses();
    renderSummary();
    closeSettleModal();
    showToast("Settled up successfully.", "success");
}
