function simplifyBalances(balances) {
    const simplified = {};

    for (const [borrower, lenders] of Object.entries(balances)) {
        for (const [lender, amount] of Object.entries(lenders)) {

            const reverse = balances[lender]?.[borrower] || 0;

            if (amount > reverse) {
                if (!simplified[borrower]) {
                    simplified[borrower] = {};
                }
                simplified[borrower][lender] = Number((amount - reverse).toFixed(2));
            }
        }
    }

    return simplified;
}

// {
//   user1: { user2: amount } 
// }
// Meaning: user1 owes amount to user2

export function calculateBalances(expenses) {
    const balances = {};

    expenses.forEach(exp => {
        const { paidBy, split } = exp;

        if (!Array.isArray(split)) return;

        split.forEach(({ userId, amount }) => {
            if (userId === paidBy)
                return;

            if (!balances[userId])
                balances[userId] = {};

            if (!balances[userId][paidBy])
                balances[userId][paidBy] = 0;

            balances[userId][paidBy] += amount;
            balances[userId][paidBy] = Number(balances[userId][paidBy].toFixed(2));
        });
    });

    return simplifyBalances(balances);
}
