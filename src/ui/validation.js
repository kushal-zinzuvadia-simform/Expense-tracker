// Form validation utilities

export function validateExpenseForm(amount, description, date, paidBy, selectedUsers, currentDate) {
    if (selectedUsers.length < 2) {
        return { valid: false, message: "Select at least two users to split" };
    }

    if (!amount || amount <= 0) {
        return { valid: false, message: "Amount must be a positive number." };
    }

    if (date > currentDate) {
        return { valid: false, message: "Future dates are not allowed." };
    }

    if (!paidBy) {
        return { valid: false, message: "Please select who paid for this expense." };
    }

    if (description.length < 3) {
        return { valid: false, message: "Description must be at least 3 characters." };
    }

    if (description.length > 50) {
        return { valid: false, message: "Description must not exceed 50 characters." };
    }

    return { valid: true };
}