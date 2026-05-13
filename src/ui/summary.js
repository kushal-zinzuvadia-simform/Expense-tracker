import { calculateBalances } from "../services/balanceService.js";
import { getExpenses } from "../services/expenseService.js";
import { getActiveUser, getUserNameById } from "../services/userService.js";

export function renderSummary() {
    const expenses = getExpenses();
    const balances = calculateBalances(expenses);
    const activeUserId = getActiveUser();
    const balanceList = document.querySelector(".balance-list");
    const totalPaid = document.querySelector(".total-paid");
    const totalSplit = document.querySelector(".total-split");
    const youOwe = document.querySelector(".you-owe");
    const youAreOwed = document.querySelector(".you-owed");

    balanceList.replaceChildren();

    // Expense amount total paidBy active user 
    let totalSpent = 0;
    expenses.forEach(exp => {
        if (exp.paidBy === activeUserId) {
            totalSpent += exp.amount;
        }
    });
    totalPaid.textContent = `₹${totalSpent.toFixed(2)}`;

    // total share across all expenses
    let userTotal = 0;
    expenses.forEach(exp => {
        if (!Array.isArray(exp.split)) return;
        exp.split.forEach(s => {
            if (s.userId === activeUserId) {
                userTotal += s.amount;
            }
        });
    });
    totalSplit.textContent = `₹${userTotal.toFixed(2)}`;

    // What the active user owes others
    const owes = balances[activeUserId] || {};
    let redTotal = 0;

    const displayName = (userId) => userId === activeUserId ? "You" : getUserNameById(userId);

    for (const [lender, amount] of Object.entries(owes)) {
        const lenderName = displayName(lender);
        const statement = `You owe ${lenderName}`;

        const item = document.createElement("div");
        item.className = "balance-item";

        const spanItem = document.createElement("span");
        spanItem.textContent = statement;

        const itemAmount = document.createElement("span");
        itemAmount.className = "amount negative";
        itemAmount.textContent = `₹${Number(amount).toFixed(2)}`;
        redTotal += amount;

        item.append(spanItem, itemAmount);
        balanceList.appendChild(item);
    }

    // What others owe the active user
    let greenTotal = 0;

    for (const [borrower, lenders] of Object.entries(balances)) {
        if (borrower === activeUserId) continue;

        for (const [lender, amount] of Object.entries(lenders)) {
            if (lender === activeUserId) {
                const borrowerName = displayName(borrower);
                const statement = `${borrowerName} owes You`;

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

    youOwe.textContent = `₹${redTotal.toFixed(2)}`;
    youAreOwed.textContent = `₹${greenTotal.toFixed(2)}`;
}
