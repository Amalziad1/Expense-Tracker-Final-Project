let expenses = [];

// Function to load expenses from local storage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    } else {
        // Add some fake data if no expenses are stored yet
        expenses = [
            { name: "Lunch", category: "Food", amount: 12.99, date: "2024-10-20" },
            { name: "Uber", category: "Transportation", amount: 8.50, date: "2024-10-21" },
            { name: "Movie Ticket", category: "Entertainment", amount: 15.00, date: "2024-10-22" },
            { name: "Electricity Bill", category: "Utilities", amount: 45.00, date: "2024-10-15" },
            { name: "Groceries", category: "Food", amount: 60.00, date: "2024-10-18" }
        ];
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    updateExpenseTable();
    updateCharts();
}

// Function to save expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Add expense form submission
document.getElementById('expenseForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const expense = {
        name: document.getElementById('expenseName').value,
        category: document.getElementById('expenseCategory').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        date: document.getElementById('expenseDate').value
    };
    expenses.push(expense);
    saveExpenses();
    alert('Expense added successfully!');
    document.getElementById('expenseForm').reset();
    updateExpenseTable();
    updateCharts();
});

// Update expense table
function updateExpenseTable() {
    const tableBody = document.getElementById('expenseTable')?.querySelector('tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    expenses.forEach((expense, index) => {
        const row = `<tr>
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.category}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense('${expense.name}')">Delete</button>
            </td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Function to edit an expense
function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expenseName').value = expense.name;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;

    // Remove the old expense
    expenses.splice(index, 1);
    saveExpenses();
    updateExpenseTable();
    updateCharts();
}

// Function to delete expense
function deleteExpense(expenseName) {
    expenses = expenses.filter(exp => exp.name !== expenseName);
    saveExpenses();
    updateExpenseTable();
    updateCharts();
}

// Initialize Chart.js charts
function updateCharts() {
    const ctxPie = document.getElementById('expensePieChart')?.getContext('2d');
    const ctxBar = document.getElementById('expenseBarChart')?.getContext('2d');
    if (!ctxPie || !ctxBar) return;

    const categories = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categoryLabels = Object.keys(categories);
    const categoryValues = Object.values(categories);

    // Destroy previous charts to avoid overlapping
    if (window.pieChart) window.pieChart.destroy();
    if (window.barChart) window.barChart.destroy();

    // Pie chart
    window.pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryValues,
                backgroundColor: ['#3f51b5', '#673ab7', '#ff9800', '#4caf50', '#f44336'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            }
        }
    });

    // Bar chart
    window.barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Total Expenses by Category (₪)',
                data: categoryValues,
                backgroundColor: '#3f51b5',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadExpenses);
function savePersonalDetails() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    localStorage.setItem('personalDetails', JSON.stringify({ name, email }));
    alert('Personal details saved successfully!');
}

function loadPersonalDetails() {
    const details = JSON.parse(localStorage.getItem('personalDetails'));
    if (details) {
        document.getElementById('userName').value = details.name;
        document.getElementById('userEmail').value = details.email;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    loadPersonalDetails();
});

