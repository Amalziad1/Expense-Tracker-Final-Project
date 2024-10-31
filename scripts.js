//  ================================================= Expense functions =================================================
let expenses = [];

// Load expenses from local storage or initialize with sample data
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    expenses = storedExpenses ? JSON.parse(storedExpenses) : [
        { name: "Lunch", category: "Food", amount: 12.99, date: "2024-10-20" },
        { name: "Uber", category: "Transportation", amount: 8.50, date: "2024-10-21" },
        { name: "Movie Ticket", category: "Entertainment", amount: 15.00, date: "2024-10-22" }
    ];
    saveExpenses();  // Save initial data if no data exists
    updateExpenseTable();
    updateExpenseCharts();
}

// Save expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Modal functions to open and close
function openAddExpenseModal() {
    document.getElementById('addExpenseModal').style.display = 'block';
}

function closeAddExpenseModal() {
    document.getElementById('addExpenseModal').style.display = 'none';
    document.getElementById('expenseForm').reset(); // Reset the form when closing
}

// Initialize expense form submission
document.addEventListener('DOMContentLoaded', function() {
    // Load expenses after DOM is fully loaded
    loadExpenses();

    // Adding event listener to expense form only after DOM is loaded
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('expenseName').value.trim();
            const category = document.getElementById('expenseCategory').value.trim();
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const date = document.getElementById('expenseDate').value.trim();

            // Check if all fields are filled and amount is a valid number
            if (!name || !category || isNaN(amount) || !date) {
                alert("Please fill out all fields correctly.");
                return;
            }

            const expense = { name, category, amount, date };
            expenses.push(expense); // Add new expense
            saveExpenses();          // Save to local storage
            updateExpenseTable();    // Refresh the table display
            updateExpenseCharts();   // Update charts

            alert('Expense added successfully!'); // Confirm addition
            closeAddExpenseModal(); // Close the modal after submission
        });
    }
});

// Update the expense table display
function updateExpenseTable() {
    const tableBody = document.getElementById('expenseTable')?.querySelector('tbody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; // Clear existing rows

    expenses.forEach((expense, index) => {
        const row = `<tr>
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.category}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            </td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Edit an existing expense
function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expenseName').value = expense.name;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;

    expenses.splice(index, 1); // Remove old expense to replace it
    saveExpenses();
    updateExpenseTable();
    updateExpenseCharts();
    openAddExpenseModal(); // Open modal with pre-filled data
}

// Delete an expense by index
function deleteExpense(index) {
    expenses.splice(index, 1); // Remove expense by index
    saveExpenses();
    updateExpenseTable();
    updateExpenseCharts();
}

// Chart.js initialization and updates
function updateExpenseCharts(filteredDate = null) {
    const ctxPie = document.getElementById('expensePieChart')?.getContext('2d');
    const ctxBar = document.getElementById('expenseBarChart')?.getContext('2d');
    if (!ctxPie || !ctxBar) return;

    // filter expenses based on the filteredDate if provided
    const filteredExpenses = filteredDate
        ? expenses.filter(expense => new Date(expense.date) >= new Date(filteredDate.start) && new Date(expense.date) <= new Date(filteredDate.end))
        : expenses;

    const categories = filteredExpenses.reduce((acc, expense) => {
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
                legend: { display: true, position: 'top' }
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
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Click outside the modal to close
window.onclick = function(event) {
    const modal = document.getElementById('addExpenseModal');
    if (event.target === modal) {
        closeAddExpenseModal();
    }
};

// Search functionality for the expense table
function searchExpenseTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("expenseTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        const td = tr[i].getElementsByTagName("td");
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}
//functions for filter window
function openDateFilterModal() {
    document.getElementById('dateFilterModal').style.display = 'block';
}

function closeDateFilterModal() {
    document.getElementById('dateFilterModal').style.display = 'none';
}

function applyDateFilter(event) {
    event.preventDefault();
    
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    const tableRows = document.querySelectorAll('#expenseTable tbody tr');

    tableRows.forEach(row => {
        const dateCell = row.querySelector('td:first-child');
        const expenseDate = new Date(dateCell.textContent);
        
        if (expenseDate >= startDate && expenseDate <= endDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    updateExpenseCharts({ start: startDate, end: endDate });

    closeDateFilterModal();
}

let sortOrder = {};
const sortIconIds = ["dateSortIcon", "nameSortIcon", "categorySortIcon", "amountSortIcon"];

function sortTable(columnIndex) {
    const table = document.getElementById("expenseTable");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const isNumeric = columnIndex === 3; //trure for amount
    sortOrder[columnIndex] = !sortOrder[columnIndex];

    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].textContent.trim();
        let cellB = rowB.cells[columnIndex].textContent.trim();

        if (isNumeric) {
            cellA = parseFloat(cellA) || 0;
            cellB = parseFloat(cellB) || 0;
        } else if (columnIndex === 0) {
            cellA = new Date(cellA);
            cellB = new Date(cellB);
        }

        if (cellA < cellB) return sortOrder[columnIndex] ? -1 : 1;
        if (cellA > cellB) return sortOrder[columnIndex] ? 1 : -1;
        return 0;
    });

    rows.forEach(row => tbody.appendChild(row)); //insert rows in sorted order again
    updateSortIcons(columnIndex);
}

function updateSortIcons(activeColumnIndex) {
    sortIconIds.forEach((iconId, index) => {
        const iconElement = document.getElementById(iconId);
        if (index === activeColumnIndex) {
            iconElement.textContent = sortOrder[activeColumnIndex] ? "▲" : "▼";
        } else {
            iconElement.textContent = "▲▼";
        }
    });
}

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
// new added:
function openAddIncomeModal() {
    document.getElementById('addIncomeModal').style.display = 'block';
}
function closeAddIncomeModal() {
    document.getElementById('addIncomeModal').style.display = 'none';
    document.getElementById('incomeForm').reset(); // Reset the form when closing
}

document.addEventListener('DOMContentLoaded', function() {
    // Load incomes after DOM is fully loaded
    loadIncomes();

    // Adding event listener to income form only after DOM is loaded
    const incomeForm = document.getElementById('incomeForm');
    if (incomeForm) {
        incomeForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('incomeName').value.trim();
            const category = document.getElementById('incomeCategory').value.trim();
            const amount = parseFloat(document.getElementById('incomeAmount').value);
            const date = document.getElementById('incomeDate').value.trim();

            // Check if all fields are filled and amount is a valid number
            if (!name || !category || isNaN(amount) || !date) {
                alert("Please fill out all fields correctly.");
                return;
            }

            const income = { name, category, amount, date };
            incomes.push(income); // Add new income
            saveIncomes();          // Save to local storage
            updateIncomeTable();    // Refresh the table display
            updateIncomeCharts();   // Update charts

            alert('Income added successfully!'); // Confirm addition
            closeAddIncomeModal(); // Close the modal after submission
        });
    }
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

function deleteIncome(incomeName) {
    incomes = incomes.filter(income => income.name !== incomeName);
    saveIncomes();
    updateIncomeTable();
    updateIncomeCharts();
}

function updateIncomeCharts(filteredDate = null) {
    const ctxPie = document.getElementById('incomePieChart')?.getContext('2d');
    const ctxBar = document.getElementById('incomeBarChart')?.getContext('2d');
    if (!ctxPie || !ctxBar) return;
    const filteredIncomes = filteredDate
        ? incomes.filter(income => new Date(income.date) >= new Date(filteredDate.start) && new Date(income.date) <= new Date(filteredDate.end))
        : incomes; 

    const categories = filteredIncomes.reduce((acc, income) => {
        acc[income.category] = (acc[income.category] || 0) + income.amount;
        return acc;
    }, {});

    const categoryLabels = Object.keys(categories);
    const categoryValues = Object.values(categories);

    if (window.pieChart) window.pieChart.destroy();
    if (window.barChart) window.barChart.destroy();
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
// Click outside the modal to close
window.onclick = function(event) {
    const modal = document.getElementById('addExpenseModal');
    if (event.target === modal) {
        closeAddExpenseModal();
    }
};

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
//functions for filter window
function openDateFilterModalForIncome() {
    document.getElementById('dateFilterModalForIncome').style.display = 'block';
}

function closeDateFilterModalForIncome() {
    document.getElementById('dateFilterModalForIncome').style.display = 'none';
}

function applyDateFilterForIncome(event) {
    event.preventDefault();
    
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    const tableRows = document.querySelectorAll('#incomeTable tbody tr');

    tableRows.forEach(row => {
        const dateCell = row.querySelector('td:first-child');
        const incomeDate = new Date(dateCell.textContent);
        
        // Show or hide row based on date range
        if (incomeDate >= startDate && incomeDate <= endDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    updateIncomeCharts({ start: startDate, end: endDate });
    closeDateFilterModalForIncome();
}
let sortIncomeOrder = {};
const sortIncomeIconIds = ["dateSortIcon", "nameSortIcon", "categorySortIcon", "amountSortIcon"];

function sortIncomeTable(columnIndex) {
    const table = document.getElementById("incomeTable");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const isNumeric = columnIndex === 3; //true for 'amount'
    sortIncomeOrder[columnIndex] = !sortIncomeOrder[columnIndex];
    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].textContent.trim();
        let cellB = rowB.cells[columnIndex].textContent.trim();

        if (isNumeric) {
            cellA = parseFloat(cellA) || 0;
            cellB = parseFloat(cellB) || 0;
        } else if (columnIndex === 0) {
            cellA = new Date(cellA);
            cellB = new Date(cellB);
        }

        if (cellA < cellB) return sortIncomeOrder[columnIndex] ? -1 : 1;
        if (cellA > cellB) return sortIncomeOrder[columnIndex] ? 1 : -1;
        return 0;
    });

    rows.forEach(row => tbody.appendChild(row)); //insert rows in sorted order again
    updateSortIncomeIcons(columnIndex);
}

function updateSortIncomeIcons(activeColumnIndex) {
    sortIconIds.forEach((iconId, index) => {
        const iconElement = document.getElementById(iconId);
        if (index === activeColumnIndex) {
            iconElement.textContent = sortIncomeOrder[activeColumnIndex] ? "▲" : "▼";
        } else {
            iconElement.textContent = "▲▼";
        }
    });
}