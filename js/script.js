
// =====================================
// SMART EXPENSE TRACKER
// Expense Management System
// =====================================

// Get HTML elements
const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");

const totalExpenseDisplay = document.getElementById("total-expense");
const expenseList = document.getElementById("expense-list");

// Format amounts in Indian Rupees
const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
});

// Format a number as Indian currency
function formatCurrency(amount) {
    return currencyFormatter.format(amount);
}

// Load saved expenses safely
function loadExpenses() {
    try {
        const savedExpenses = JSON.parse(
            localStorage.getItem("expenses") || "[]"
        );

        if (!Array.isArray(savedExpenses)) {
            return [];
        }

        return savedExpenses.filter(expense =>
            expense &&
            typeof expense.description === "string" &&
            typeof expense.amount === "number" &&
            Number.isFinite(expense.amount) &&
            expense.amount > 0 &&
            typeof expense.category === "string"
        );
    } catch (error) {
        console.error("Unable to load expenses:", error);
        return [];
    }
}

let expenses = loadExpenses();

// Save expenses to browser storage
function saveExpenses() {
    try {
        localStorage.setItem("expenses", JSON.stringify(expenses));
        return true;
    } catch (error) {
        console.error("Unable to save expenses:", error);
        alert("Unable to save expenses. Check browser storage.");
        return false;
    }
}
// Display expenses and calculate total
function renderExpenses() {
    expenseList.innerHTML = "";

    let total = 0;

    if (expenses.length === 0) {
        expenseList.innerHTML =
            '<p class="empty-message">No expenses added yet.</p>';
    }

    expenses.forEach((expense, index) => {
        total += expense.amount;

        const expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";

        const expenseDetails = document.createElement("div");
        expenseDetails.className = "expense-details";

        const description = document.createElement("strong");
        description.textContent = expense.description;

        const category = document.createElement("small");
        category.textContent = expense.category;

        expenseDetails.appendChild(description);
        expenseDetails.appendChild(category);

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = formatCurrency(expense.amount);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const deletedExpense = expenses.splice(index, 1)[0];

            if (!saveExpenses()) {
                expenses.splice(index, 0, deletedExpense);
                alert("Unable to delete expense. Please try again.");
                return;
            }

            renderExpenses();
        });

        expenseItem.appendChild(expenseDetails);
        expenseItem.appendChild(amount);
        expenseItem.appendChild(deleteButton);

        expenseList.appendChild(expenseItem);
    });

    totalExpenseDisplay.textContent = formatCurrency(total);
}

// Handle new expense submission
expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    // Validate user input
    if (!description || !Number.isFinite(amount) || amount <= 0 || !category) {
        alert("Please enter valid expense details.");
        return;
    }

    // Create new expense
    const newExpense = {
        description: description,
        amount: amount,
        category: category
    };

    // Add expense to the list
    expenses.push(newExpense);

    // Save before updating the interface
    if (!saveExpenses()) {
        expenses.pop();
        return;
    }

    // Update dashboard
    renderExpenses();

    // Clear form
    expenseForm.reset();

    console.log("Expense added successfully:", newExpense);
});

// Display previously saved expenses
renderExpenses();

console.log("Smart Expense Tracker initialized successfully!");
