let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Add Expense
addBtn.addEventListener('click', async function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!category) {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (!date) {
        alert('Please select a date');
        return;
    }


    // Load all expenses from server on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/expenses');
        if (response.ok) {
            expenses = await response.json();
            updateExpenseTable();
        } else {
            console.error('Failed to load expenses');
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
});

function updateExpenseTable() {
    expenseTableBody.innerHTML = '';
    totalAmount = 0;

    expenses.forEach(expense => {
        const newRow = expenseTableBody.insertRow();
        newRow.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td><button onclick="deleteExpense('${expense._id}')">Delete</button></td>
        `;
        totalAmount += expense.amount;
    });

    totalAmountCell.textContent = totalAmount;
}


    try {
        const response = await fetch('/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, amount, date })
        });

        if (response.ok) {
            const data = await response.json();
            expenses.push(data);
            updateExpenseTable();
        } else {
            const error = await response.json();
            alert('Failed to add expense: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    }
});

// Delete Expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`/expenses/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            expenses = expenses.filter(exp => exp._id !== id);
            updateExpenseTable();
        } else {
            alert('Failed to delete expense');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Update Table
function updateExpenseTable() {
    expenseTableBody.innerHTML = '';
    totalAmount = 0;

    expenses.forEach(exp => {
        const row = expenseTableBody.insertRow();
        row.innerHTML = `
            <td>${exp.category}</td>
            <td>${exp.amount}</td>
            <td>${new Date(exp.date).toLocaleDateString()}</td>
            <td><button onclick="deleteExpense('${exp._id}')">Delete</button></td>
        `;
        totalAmount += exp.amount;
    });

    totalAmountCell.textContent = totalAmount;
}
