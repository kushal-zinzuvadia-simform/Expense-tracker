function simplifyBalances(balances) {
    const simplified = {};

    for (const borrower in balances) {
        for (const lender in balances[borrower]) {

            const amount = balances[borrower][lender];
            const reverse = balances[lender]?.[borrower] || 0;

            if (amount > reverse) {
                if (!simplified[borrower]) {
                    simplified[borrower] = {};
                }
                simplified[borrower][lender] = amount - reverse;
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

        split.forEach(({ userId, amount }) => {
            if (userId === paidBy)
                return;

            if (!balances[userId])
                balances[userId] = {};

            if (!balances[userId][paidBy])
                balances[userId][paidBy] = 0;

            balances[userId][paidBy] += amount;
        });
    });

    return simplifyBalances(balances);
}
