import { calculateBalances } from "../services/balanceService.js";
import { getExpenses } from "../services/expenseService.js";
import { getActiveUser, getUserNameById } from "../services/userService.js";

export function renderSummary() {
    const expenses = getExpenses();
    const balances = calculateBalances(expenses);
    const activeUserId = getActiveUser();
    const activeUserName = getUserNameById(activeUserId);
    const balanceList = document.querySelector(".balance-list");
    const totalSpent = document.querySelector(".total-spent");
    const youOwe = document.querySelector(".you-owe");
    const youAreOwed = document.querySelector(".you-owed");

    balanceList.replaceChildren();

    // Calculate total spent
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalSpent.textContent = `₹${total}`;

    // What the active user owes others
    const owes = balances[activeUserId] || {};
    let redTotal = 0;

    for (const [lender, amount] of Object.entries(owes)) {
        const lenderName = getUserNameById(isNaN(lender) ? lender : Number(lender));
        const statement = `${activeUserName} owes ${lenderName}`;

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

    // What others owe the active user
    let greenTotal = 0;

    for (const [borrower, lenders] of Object.entries(balances)) {
        if (borrower === activeUserId || borrower === String(activeUserId)) continue;

        for (const [lender, amount] of Object.entries(lenders)) {
            if (lender === String(activeUserId) || lender === activeUserId) {
                const borrowerName = getUserNameById(isNaN(borrower) ? borrower : Number(borrower));
                const statement = `${borrowerName} owes ${activeUserName}`;

                const item = document.createElement("div");
                item.className = "balance-item";

                const spanItem = document.createElement("span");
                spanItem.textContent = statement;

                const itemAmount = document.createElement("span");
                itemAmount.className = "amount positive";
                itemAmount.textContent = `₹${amount}`;
                greenTotal += amount;

                item.append(spanItem, itemAmount);
                balanceList.appendChild(item);
            }
        }
    }

    youOwe.textContent = `₹${redTotal}`;
    youAreOwed.textContent = `₹${greenTotal}`;
}