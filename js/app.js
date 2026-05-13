var transactions = [];
var chart = null;
var spendingLimit = 0;
var isDark = false;

window.onload = function() {
  var saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
  }

  var savedLimit = localStorage.getItem('spendingLimit');
  if (savedLimit) {
    spendingLimit = parseFloat(savedLimit);
    document.getElementById('spendingLimit').value = spendingLimit;
  }

  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark = true;
    document.body.classList.add('dark');
    document.getElementById('toggleTheme').textContent = '☀️ Light Mode';
  }

  renderAll();
}

function toggleTheme() {
  isDark = !isDark;
  if (isDark) {
    document.body.classList.add('dark');
    document.getElementById('toggleTheme').textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    document.getElementById('toggleTheme').textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'light');
  }
  renderChart();
}

function saveLimit() {
  var val = document.getElementById('spendingLimit').value;
  if (val === '' || val <= 0) {
    alert('Please enter a valid limit!');
    return;
  }
  spendingLimit = parseFloat(val);
  localStorage.setItem('spendingLimit', spendingLimit);
  renderAll();
}

function addTransaction() {
  var name = document.getElementById('itemName').value.trim();
  var amount = document.getElementById('itemAmount').value.trim();
  var category = document.getElementById('itemCategory').value;

  if (name === '' || amount === '') {
    alert('Please fill in all fields!');
    return;
  }

  var newItem = {
    id: Date.now(),
    name: name,
    amount: parseFloat(amount),
    category: category
  };

  transactions.push(newItem);
  saveToStorage();
  renderAll();

  document.getElementById('itemName').value = '';
  document.getElementById('itemAmount').value = '';
}

function deleteTransaction(id) {
  transactions = transactions.filter(function(t) {
    return t.id !== id;
  });
  saveToStorage();
  renderAll();
}

function saveToStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getSortedTransactions() {
  var sortOption = document.getElementById('sortOption').value;
  var sorted = transactions.slice();

  if (sortOption === 'amount-asc') {
    sorted.sort(function(a, b) { return a.amount - b.amount; });
  } else if (sortOption === 'amount-desc') {
    sorted.sort(function(a, b) { return b.amount - a.amount; });
  } else if (sortOption === 'category') {
    sorted.sort(function(a, b) { return a.category.localeCompare(b.category); });
  }

  return sorted;
}

function renderAll() {
  updateBalance();
  renderList();
  renderChart();
  checkLimit();
}

function updateBalance() {
  var total = 0;
  for (var i = 0; i < transactions.length; i++) {
    total += transactions[i].amount;
  }
  var balanceEl = document.getElementById('totalBalance');
  balanceEl.textContent = '$' + total.toFixed(2);

  if (spendingLimit > 0 && total > spendingLimit) {
    balanceEl.classList.add('over-limit');
  } else {
    balanceEl.classList.remove('over-limit');
  }
}

function checkLimit() {
  var total = 0;
  for (var i = 0; i < transactions.length; i++) {
    total += transactions[i].amount;
  }

  var statusEl = document.getElementById('limitStatus');
  if (spendingLimit > 0 && total > spendingLimit) {
    statusEl.textContent = '⚠️ You have exceeded your spending limit of $' + spendingLimit.toFixed(2) + '!';
  } else if (spendingLimit > 0) {
    statusEl.textContent = '✅ Within limit. $' + (spendingLimit - total).toFixed(2) + ' remaining.';
    statusEl.style.color = '#27ae60';
  } else {
    statusEl.textContent = '';
  }
}

function renderList() {
  var list = document.getElementById('transactionList');
  list.innerHTML = '';

  var sorted = getSortedTransactions();

  if (sorted.length === 0) {
    list.innerHTML = '<p style="color:#aaa;font-size:13px;">No transactions yet.</p>';
    return;
  }

  var total = 0;
  for (var i = 0; i < transactions.length; i++) {
    total += transactions[i].amount;
  }

  for (var i = 0; i < sorted.length; i++) {
    var t = sorted[i];
    var isOver = spendingLimit > 0 && total > spendingLimit;

    var div = document.createElement('div');
    div.className = 'transaction-item' + (isOver ? ' over' : '');
    div.innerHTML =
      '<div class="info">' +
        '<div class="name">' + t.name + '</div>' +
        '<div class="amount' + (isOver ? ' over' : '') + '">$' + t.amount.toFixed(2) + '</div>' +
        '<span class="category">' + t.category + '</span>' +
      '</div>' +
      '<button onclick="deleteTransaction(' + t.id + ')">Delete</button>';
    list.appendChild(div);
  }
}

function renderChart() {
  var food = 0, transport = 0, fun = 0;

  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].category === 'Food') food += transactions[i].amount;
    else if (transactions[i].category === 'Transport') transport += transactions[i].amount;
    else if (transactions[i].category === 'Fun') fun += transactions[i].amount;
  }

  var ctx = document.getElementById('spendingChart').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Food', 'Transport', 'Fun'],
      datasets: [{
        data: [food, transport, fun],
        backgroundColor: ['#2ecc71', '#3498db', '#e67e22']
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDark ? '#eee' : '#333'
          }
        }
      }
    }
  });
}