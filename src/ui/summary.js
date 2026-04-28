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

    // total share across all expenses
    let userTotal = 0;
    expenses.forEach(exp => {
        if (!Array.isArray(exp.split)) return;
        exp.split.forEach(s => {
            if (String(s.userId) === String(activeUserId)) {
                userTotal += s.amount;
            }
        });
    });
    totalSpent.textContent = `₹${userTotal}`;

    // What the active user owes others
    const owes = balances[activeUserId] || {};
    let redTotal = 0;

    for (const [lender, amount] of Object.entries(owes)) {
        const lenderName = getUserNameById(lender);
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
        if (String(borrower) === String(activeUserId)) continue;

        for (const [lender, amount] of Object.entries(lenders)) {
            if (String(lender) === String(activeUserId)) {
                const borrowerName = getUserNameById(borrower);
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

    // Show empty message when no balance items
    if (redTotal === 0 && greenTotal === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "balance-empty";
        emptyMsg.textContent = "Add expenses to see who owes whom.";
        balanceList.appendChild(emptyMsg);
    }

    youOwe.textContent = `₹${redTotal}`;
    youAreOwed.textContent = `₹${greenTotal}`;
}