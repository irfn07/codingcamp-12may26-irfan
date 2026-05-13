var transactions = [];
var chart = null;

window.onload = function() {
  var saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
  }
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

function renderAll() {
  updateBalance();
  renderList();
  renderChart();
}

function updateBalance() {
  var total = 0;
  for (var i = 0; i < transactions.length; i++) {
    total += transactions[i].amount;
  }
  document.getElementById('totalBalance').textContent = '$' + total.toFixed(2);
}

function renderList() {
  var list = document.getElementById('transactionList');
  list.innerHTML = '';

  if (transactions.length === 0) {
    list.innerHTML = '<p style="color:#aaa;font-size:13px;">No transactions yet.</p>';
    return;
  }

  for (var i = 0; i < transactions.length; i++) {
    var t = transactions[i];
    var div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML =
      '<div class="info">' +
        '<div class="name">' + t.name + '</div>' +
        '<div class="amount">$' + t.amount.toFixed(2) + '</div>' +
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
          position: 'bottom'
        }
      }
    }
  });
}