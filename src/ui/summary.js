import { calculateBalances } from "../services/balanceService.js";
import { getExpenses } from "../services/expenseService.js";

export function renderSummary() {
    const expenses = getExpenses();
    const balances = calculateBalances(expenses);
    console.log(balances);
}