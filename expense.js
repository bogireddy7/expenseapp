const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction() {
    const text = document.getElementById('text').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const amount = +document.getElementById('amount').value;

    if (text === '' || amount === 0 || date === '') {
        alert("Please enter valid details");
        return;
    }

    const transaction = {
        id: Date.now(),
        text,
        category,
        date,
        amount
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();

    document.getElementById('text').value = '';
    document.getElementById('amount').value = '';
}

function addTransactionDOM(transaction) {
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        <div class="transaction-details">
            <strong>${transaction.text}</strong>
            <small>${transaction.category} | ${transaction.date}</small>
        </div>
        <div class="actions">
            ₹${Math.abs(transaction.amount)}
            <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
        </div>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0);
    const incomeTotal = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
    const expenseTotal = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

    balance.innerText = `₹${total}`;
    income.innerText = `₹${incomeTotal}`;
    expense.innerText = `₹${expenseTotal}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);

    document.getElementById('text').value = transaction.text;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('date').value = transaction.date;
    document.getElementById('category').value = transaction.category;

    removeTransaction(id);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
