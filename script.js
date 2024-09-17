document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('habit-form');
    const tokenList = document.getElementById('token-list');
    const futuresList = document.getElementById('futures-list');
    const optionsList = document.getElementById('options-list');
    const swapsList = document.getElementById('swaps-list');
    const tradeForm = document.getElementById('trade-form');
    const simulationBtn = document.getElementById('run-simulation');

    // Add test habit contracts
    addTestHabitContracts();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const habit = document.getElementById('habit').value;
        const frequency = parseInt(document.getElementById('frequency').value);
        const duration = parseInt(document.getElementById('duration').value);
        const stake = parseFloat(document.getElementById('stake').value);

        // Generate financial instruments
        const tokenId = generateToken(habit, stake);
        const futureId = generateFuture(tokenId, duration);
        const optionId = generateOption(tokenId, duration);
        const swapId = generateSwap(tokenId, duration);

        // Add the new contract and financial instruments to the platform
        addTokenToMarket(habit, frequency, duration, stake, tokenId);
        addFutureToMarket(futureId, tokenId, duration);
        addOptionToMarket(optionId, tokenId, duration);
        addSwapToMarket(swapId, tokenId, duration);

        // Update order book
        updateOrderBook();

        alert('Habit contract created and financial instruments generated successfully!');
    });

    tradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const assetType = document.getElementById('asset-type').value;
        const assetId = document.getElementById('asset-id').value;
        const tradeType = document.getElementById('trade-type').value;
        const amount = parseFloat(document.getElementById('trade-amount').value);
        const price = parseFloat(document.getElementById('trade-price').value);

        executeTrade(assetType, assetId, tradeType, amount, price);
    });

    simulationBtn.addEventListener('click', runMarketSimulation);
});

function addTestHabitContracts() {
    const testContracts = [
        { habit: "Daily Meditation", frequency: 7, duration: 4, stake: 0.5 },
        { habit: "Gym Workout", frequency: 3, duration: 12, stake: 1.2 },
        { habit: "Read 30 Minutes", frequency: 5, duration: 8, stake: 0.8 },
        { habit: "Learn a New Language", frequency: 4, duration: 24, stake: 2.5 },
        { habit: "Healthy Meal Prep", frequency: 2, duration: 16, stake: 1.0 }
    ];

    testContracts.forEach((contract) => {
        const tokenId = generateToken(contract.habit, contract.stake);
        const futureId = generateFuture(tokenId, contract.duration);
        const optionId = generateOption(tokenId, contract.duration);
        const swapId = generateSwap(tokenId, contract.duration);

        addTokenToMarket(contract.habit, contract.frequency, contract.duration, contract.stake, tokenId);
        addFutureToMarket(futureId, tokenId, contract.duration);
        addOptionToMarket(optionId, tokenId, contract.duration);
        addSwapToMarket(swapId, tokenId, contract.duration);
    });

    updateOrderBook();
}

function addTokenToMarket(habit, frequency, duration, stake, tokenId) {
    const tokenList = document.getElementById('token-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>Token ID:</strong> ${tokenId}<br>
        <strong>Habit:</strong> ${habit}<br>
        <strong>Frequency:</strong> ${frequency} times/week<br>
        <strong>Duration:</strong> ${duration} weeks<br>
        <strong>Stake:</strong> ${stake} ETH<br>
        <strong>Current Value:</strong> ${stake} ETH
    `;
    tokenList.appendChild(listItem);
}

function addFutureToMarket(futureId, tokenId, duration) {
    const futuresList = document.getElementById('futures-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>Future ID:</strong> ${futureId}<br>
        <strong>Underlying Token:</strong> ${tokenId}<br>
        <strong>Expiry:</strong> ${duration} weeks<br>
        <strong>Current Price:</strong> ${(Math.random() * 0.1 + 0.9).toFixed(4)} ETH
    `;
    futuresList.appendChild(listItem);
}

function addOptionToMarket(optionId, tokenId, duration) {
    const optionsList = document.getElementById('options-list');
    const listItem = document.createElement('li');
    const strikePrice = (Math.random() * 0.5 + 0.5).toFixed(4);
    listItem.innerHTML = `
        <strong>Option ID:</strong> ${optionId}<br>
        <strong>Type:</strong> ${Math.random() > 0.5 ? 'Call' : 'Put'}<br>
        <strong>Underlying Token:</strong> ${tokenId}<br>
        <strong>Strike Price:</strong> ${strikePrice} ETH<br>
        <strong>Expiry:</strong> ${duration} weeks<br>
        <strong>Premium:</strong> ${(strikePrice * 0.1).toFixed(4)} ETH
    `;
    optionsList.appendChild(listItem);
}

function addSwapToMarket(swapId, tokenId, duration) {
    const swapsList = document.getElementById('swaps-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>Swap ID:</strong> ${swapId}<br>
        <strong>Token 1:</strong> ${tokenId}<br>
        <strong>Token 2:</strong> ETH<br>
        <strong>Duration:</strong> ${duration} weeks<br>
        <strong>Exchange Rate:</strong> 1 ${tokenId} = ${(Math.random() * 0.5 + 0.5).toFixed(4)} ETH
    `;
    swapsList.appendChild(listItem);
}

function updateOrderBook() {
    const bids = document.getElementById('bids');
    const asks = document.getElementById('asks');

    bids.innerHTML = '<h4>Bids</h4>';
    asks.innerHTML = '<h4>Asks</h4>';

    for (let i = 0; i < 5; i++) {
        const bidPrice = (1 - i * 0.01).toFixed(6);
        const askPrice = (1 + i * 0.01).toFixed(6);
        const volume = (Math.random() * 10).toFixed(2);

        bids.innerHTML += `<p>${bidPrice} ETH - ${volume} units</p>`;
        asks.innerHTML += `<p>${askPrice} ETH - ${volume} units</p>`;
    }
}

function executeTrade(assetType, assetId, tradeType, amount, price) {
    console.log(`Executing trade: ${tradeType} ${amount} of ${assetType} ${assetId} at ${price} ETH`);
    alert(`Trade executed: ${tradeType} ${amount} of ${assetType} ${assetId} at ${price} ETH`);
    updateOrderBook();
}

// Financial instrument generation functions
function generateToken(habit, stake) {
    return `TKN-${habit.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(7)}`;
}

function generateFuture(tokenId, duration) {
    return `FUT-${tokenId}-${duration}W`;
}

function generateOption(tokenId, duration) {
    return `OPT-${tokenId}-${duration}W`;
}

function generateSwap(tokenId, duration) {
    return `SWP-${tokenId}-${duration}W`;
}

// Market simulation function
function runMarketSimulation() {
    const simulationResults = document.getElementById('simulation-results');
    simulationResults.innerHTML = '<h3>Market Simulation Results</h3>';

    const scenarios = [
        { name: "Bull Market", marketTrend: 0.2 },
        { name: "Bear Market", marketTrend: -0.15 },
        { name: "Volatile Market", marketTrend: 0 },
        { name: "Stable Market", marketTrend: 0.05 }
    ];

    scenarios.forEach(scenario => {
        simulationResults.innerHTML += `<h4>${scenario.name}</h4>`;
        
        const tokenValue = (1 + scenario.marketTrend + (Math.random() * 0.2 - 0.1)).toFixed(2);
        const futurePrice = (tokenValue * (1 + Math.random() * 0.1)).toFixed(2);
        const optionPremium = (tokenValue * 0.1 * (1 + scenario.marketTrend)).toFixed(2);
        const swapRate = (1 / tokenValue).toFixed(4);

        simulationResults.innerHTML += `
            <p>Token Value: ${tokenValue} ETH</p>
            <p>Future Price: ${futurePrice} ETH</p>
            <p>Option Premium: ${optionPremium} ETH</p>
            <p>Swap Rate: 1 Token = ${swapRate} ETH</p>
        `;
    });

    updateVisualization(scenarios);
}

// Visualization update function
function updateVisualization(scenarios) {
    const ctx = document.getElementById('market-chart').getContext('2d');
    
    const data = {
        labels: scenarios.map(s => s.name),
        datasets: [{
            label: 'Token Value',
            data: scenarios.map(s => (1 + s.marketTrend + (Math.random() * 0.2 - 0.1)).toFixed(2)),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        },
        {
            label: 'Future Price',
            data: scenarios.map(s => ((1 + s.marketTrend + (Math.random() * 0.2 - 0.1)) * (1 + Math.random() * 0.1)).toFixed(2)),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}