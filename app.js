// Initialize Lucide icons
lucide.createIcons();

// Mock data for initial stocks
const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 0.85, quantity: 10 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: -0.32, quantity: 5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.65, change: 1.23, quantity: 8 },
];

// State management
let stocks = [...mockStocks];
let selectedStock = stocks[0].symbol;
let chart = null;

// DOM Elements
const portfolioValueEl = document.getElementById('portfolio-value');
const dailyChangeEl = document.getElementById('daily-change');
const addStockForm = document.getElementById('addStockForm');
const stockListEl = document.querySelector('.stock-items');
const chartCanvas = document.getElementById('stockChart');

// Helper functions
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function calculatePortfolioValue() {
  return stocks.reduce((total, stock) => total + stock.price * stock.quantity, 0);
}

function calculateDailyChange() {
  const totalChange = stocks.reduce(
    (total, stock) => total + stock.change * stock.price * stock.quantity,
    0
  );
  return (totalChange / calculatePortfolioValue()) * 100;
}

function updateStats() {
  portfolioValueEl.textContent = formatCurrency(calculatePortfolioValue());
  const dailyChange = calculateDailyChange();
  dailyChangeEl.textContent = `${dailyChange.toFixed(2)}%`;
  
  const trendingIcon = dailyChangeEl.previousElementSibling;
  if (dailyChange >= 0) {
    trendingIcon.setAttribute('data-lucide', 'trending-up');
    trendingIcon.style.color = 'rgb(16, 185, 129)';
  } else {
    trendingIcon.setAttribute('data-lucide', 'trending-down');
    trendingIcon.style.color = 'rgb(239, 68, 68)';
  }
  lucide.createIcons();
}

function createStockItem(stock) {
  const div = document.createElement('div');
  div.className = `stock-item ${stock.symbol === selectedStock ? 'selected' : ''}`;
  div.onclick = () => selectStock(stock.symbol);
  
  div.innerHTML = `
    <div class="stock-item-header">
      <div class="stock-info">
        <h3>${stock.symbol}</h3>
        <p>${stock.name}</p>
      </div>
      <div class="price-info">
        <p class="price">${formatCurrency(stock.price)}</p>
        <div class="change ${stock.change >= 0 ? 'positive' : 'negative'}">
          <i data-lucide="${stock.change >= 0 ? 'trending-up' : 'trending-down'}"></i>
          <span>${stock.change}%</span>
        </div>
      </div>
    </div>
    <div class="stock-item-footer">
      <span class="quantity">Quantity: ${stock.quantity}</span>
      <span class="total">Total: ${formatCurrency(stock.price * stock.quantity)}</span>
    </div>
  `;
  
  return div;
}

function updateStockList() {
  stockListEl.innerHTML = '';
  stocks.forEach(stock => {
    stockListEl.appendChild(createStockItem(stock));
  });
  lucide.createIcons();
}

function selectStock(symbol) {
  selectedStock = symbol;
  updateStockList();
  updateChart();
}

function updateChart() {
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    prices: Array(6).fill(0).map(() => 100 + Math.random() * 100)
  };

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: mockData.labels,
      datasets: [{
        label: selectedStock,
        data: mockData.prices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'system-ui',
              weight: '600',
              size: 14
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: `${selectedStock} Price History`,
          font: {
            family: 'system-ui',
            size: 18,
            weight: '600'
          },
          padding: { top: 20, bottom: 24 },
          color: '#1e40af'
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1e40af',
          bodyColor: '#1e40af',
          bodyFont: {
            weight: '600'
          },
          padding: 12,
          borderColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context) => formatCurrency(context.parsed.y)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.03)',
            drawBorder: false
          },
          ticks: {
            callback: (value) => formatCurrency(value),
            font: {
              weight: '500'
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              weight: '500'
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// Event listeners
addStockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const symbolInput = document.getElementById('symbol');
  const quantityInput = document.getElementById('quantity');
  
  const newStock = {
    symbol: symbolInput.value.toUpperCase(),
    name: `${symbolInput.value.toUpperCase()} Corp.`,
    price: 100 + Math.random() * 100,
    change: -5 + Math.random() * 10,
    quantity: parseInt(quantityInput.value, 10)
  };
  
  stocks.push(newStock);
  updateStockList();
  updateStats();
  
  symbolInput.value = '';
  quantityInput.value = '';
});

// Initialize the app
updateStockList();
updateStats();
updateChart();
