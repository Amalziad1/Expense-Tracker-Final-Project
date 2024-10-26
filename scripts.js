//  ================================================= Income functions =================================================

let expenses = [];

//loading expenses from local storage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    } else {
        //fake data
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
    updateExpenseCharts();
}

//saving expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

//adding expense form submission
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
    updateExpenseCharts();
});

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

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expenseName').value = expense.name;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;

    // remove the old expense
    expenses.splice(index, 1);
    saveExpenses();
    updateExpenseTable();
    updateExpenseCharts();
}

function deleteExpense(expenseName) {
    expenses = expenses.filter(exp => exp.name !== expenseName);
    saveExpenses();
    updateExpenseTable();
    updateExpenseCharts();
}

//initialize Chart.js charts
function updateExpenseCharts() {
    const ctxPie = document.getElementById('expensePieChart')?.getContext('2d');
    const ctxBar = document.getElementById('expenseBarChart')?.getContext('2d');
    if (!ctxPie || !ctxBar) return;

    const categories = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categoryLabels = Object.keys(categories);
    const categoryValues = Object.values(categories);

    // destroy previous charts to avoid overlapping
    if (window.pieChart) window.pieChart.destroy();
    if (window.barChart) window.barChart.destroy();

    //Pie chart
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

    //Bar chart
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
function searchExpenseTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("expenseTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}
// Load expenses when the page is ready
document.addEventListener('DOMContentLoaded', loadExpenses);

//  ================================================= Income functions =================================================
let incomes = [];

function loadIncomes() {
    const storedIncomes = localStorage.getItem('incomes');
    if (storedIncomes) {
        incomes = JSON.parse(storedIncomes);
    } else {
        localStorage.setItem('incomes', JSON.stringify(incomes));
    }
    updateIncomeTable();
    updateIncomeCharts();
}

function saveIncomes() {
    localStorage.setItem('incomes', JSON.stringify(incomes));
}

document.getElementById('incomeForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const income = {
        name: document.getElementById('incomeName').value,
        category: document.getElementById('incomeCategory').value,
        amount: parseFloat(document.getElementById('incomeAmount').value),
        date: document.getElementById('incomeDate').value
    };
    incomes.push(income);
    saveIncomes();
    alert('Income added successfully!');
    document.getElementById('incomeForm').reset();
    updateIncomeTable();
    updateIncomeCharts();
});

function updateIncomeTable() {
    const tableBody = document.getElementById('incomeTable')?.querySelector('tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    incomes.forEach((income, index) => {
        const row = `<tr>
            <td>${income.date}</td>
            <td>${income.name}</td>
            <td>${income.category}</td>
            <td>${income.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editIncome(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteIncome('${income.name}')">Delete</button>
            </td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function editIncome(index) {
    const income = incomes[index];
    document.getElementById('incomeName').value = income.name;
    document.getElementById('incomeCategory').value = income.category;
    document.getElementById('incomeAmount').value = income.amount;
    document.getElementById('incomeDate').value = income.date;

    incomes.splice(index, 1);
    saveIncomes();
    updateIncomeTable();
    updateIncomeCharts();
}

function deleteIncome(incomeName) {
    incomes = incomes.filter(income => income.name !== incomeName);
    saveIncomes();
    updateIncomeTable();
    updateIncomeCharts();
}

function updateIncomeCharts() {
    const ctxPie = document.getElementById('incomePieChart')?.getContext('2d');
    const ctxBar = document.getElementById('incomeBarChart')?.getContext('2d');
    if (!ctxPie || !ctxBar) return;

    const categories = incomes.reduce((acc, income) => {
        acc[income.category] = (acc[income.category] || 0) + income.amount;
        return acc;
    }, {});

    const categoryLabels = Object.keys(categories);
    const categoryValues = Object.values(categories);

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
                label: 'Total Incomes by Category (₪)',
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

// load incomes when the page is ready
document.addEventListener('DOMContentLoaded', loadIncomes);

function searchIncomeTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("incomeTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none"; 
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}