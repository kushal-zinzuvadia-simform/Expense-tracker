import { calculateBalances } from "../services/balanceService.js";
import { getExpenses } from "../services/expenseService.js";
import { getActiveUser, getUserNameById } from "../services/userService.js";

export function renderSummary() {
    const expenses = getExpenses();
    const balances = calculateBalances(expenses);
    const activeUserId = getActiveUser();
    const activeUserName = getUserNameById(activeUserId);
    const balanceList = document.querySelector(".balance-list");
    const youOwe = document.querySelector(".you-owe");
    const youAreOwed = document.querySelector(".you-owed");

    balanceList.replaceChildren();

    const owes = balances[activeUserId] || {};
    let redTotal = 0, greenTotal = 0;

    for (const [lender, amount] of Object.entries(owes)) {
        const lenderId = Number(lender);
        const statement = `${activeUserName} owes ${getUserNameById(lenderId)}`;

        const item = document.createElement("div");
        item.className = "balance-item";

        const spanItem = document.createElement("span");
        spanItem.textContent = statement;

        const itemAmount = document.createElement("span");
        itemAmount.className = "amount negative";
        itemAmount.textContent = `₹${amount}`;
        redTotal += amount;

        item.append(spanItem, itemAmount);
        balanceList.appendChild(item);
    }

    youOwe.textContent = `₹${redTotal}`;
}