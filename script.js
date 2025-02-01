document.addEventListener('DOMContentLoaded', () => {
    // Initialize views
    initializeViews();
    
    // Initialize form steps
    initializeFormSteps();
    
    // Initialize interactive elements
    initializeInteractions();
    
    // Add test data
    addTestData();
});

// View Management
function initializeViews() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            switchView(view);
        });
    });
}

function switchView(viewId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewId);
    });
    
    // Update view visibility
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `${viewId}-view`);
    });
}

// Multi-step Form
function initializeFormSteps() {
    const form = document.getElementById('habit-form');
    if (!form) return;

    // Step navigation
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const nextStep = currentStep.nextElementSibling;
            if (nextStep && validateStep(currentStep)) {
                updateFormStep(currentStep, nextStep);
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const prevStep = currentStep.previousElementSibling;
            if (prevStep) {
                updateFormStep(currentStep, prevStep);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Initialize interactive form elements
    initializeFrequencySelector();
    initializeDurationSlider();
    initializeStakeOptions();
}

function validateStep(step) {
    const inputs = step.querySelectorAll('input[required], select[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('error');
        }
    });
    return isValid;
}

function updateFormStep(currentStep, newStep) {
    // Update steps
    currentStep.classList.remove('active');
    newStep.classList.add('active');
    
    // Update progress indicator
    const stepNumber = newStep.dataset.step;
    document.querySelectorAll('.step').forEach(step => {
        step.classList.toggle('active', step.dataset.step <= stepNumber);
    });

    // Update preview in final step
    if (newStep.dataset.step === '3') {
        updateContractPreview();
    }
}

function initializeFrequencySelector() {
    const options = document.querySelectorAll('.frequency-option');
    const input = document.getElementById('frequency');

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            input.value = option.dataset.value;
        });
    });
}

function initializeDurationSlider() {
    const slider = document.getElementById('duration');
    const display = document.querySelector('.duration-value');

    if (slider && display) {
        slider.addEventListener('input', () => {
            display.textContent = slider.value;
        });
    }
}

function initializeStakeOptions() {
    const options = document.querySelectorAll('.stake-option');
    const input = document.getElementById('stake');

    options.forEach(option => {
        option.addEventListener('click', () => {
            input.value = option.dataset.value;
        });
    });
}

function updateContractPreview() {
    document.getElementById('preview-habit').textContent = document.getElementById('habit').value;
    document.getElementById('preview-category').textContent = document.querySelector('input[name="category"]:checked')?.value || 'Not selected';
    document.getElementById('preview-frequency').textContent = `${document.getElementById('frequency').value} times per week`;
    document.getElementById('preview-duration').textContent = `${document.getElementById('duration').value} weeks`;
    document.getElementById('preview-stake').textContent = `${document.getElementById('stake').value} ETH`;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const habit = document.getElementById('habit').value;
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const frequency = document.getElementById('frequency').value;
    const duration = document.getElementById('duration').value;
    const stake = document.getElementById('stake').value;

    // Create contract
    const tokenId = generateToken(habit, stake);
    const futureId = generateFuture(tokenId, duration);
    const optionId = generateOption(tokenId, duration);
    const swapId = generateSwap(tokenId, duration);

    // Add to dashboard
    const habitsList = document.getElementById('active-habits');
    if (habitsList) {
        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card';
        habitCard.innerHTML = `
            <div class="habit-header">
                <h4>${habit}</h4>
                <span class="streak">0 day streak</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: 0%"></div>
            </div>
            <div class="habit-footer">
                <span class="completion">0% Complete</span>
                <button class="check-in-btn">Check In</button>
            </div>
        `;
        habitsList.appendChild(habitCard);
    }

    // Update portfolio value
    const portfolioValue = document.querySelector('.nav-stats .stat-value');
    if (portfolioValue) {
        const currentValue = parseFloat(portfolioValue.textContent);
        portfolioValue.textContent = `${(currentValue + parseFloat(stake)).toFixed(2)} ETH`;
    }

    // Update active contracts count
    const activeContracts = document.querySelector('.nav-stats .stat-value:last-child');
    if (activeContracts) {
        const currentCount = parseInt(activeContracts.textContent);
        activeContracts.textContent = currentCount + 1;
    }

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Habit Contract created successfully!';
    document.querySelector('.create-container').appendChild(successMessage);

    // Switch to dashboard view after a delay
    setTimeout(() => {
        switchView('dashboard');
        successMessage.remove();
    }, 2000);
}

// Trading Platform
function initializeInteractions() {
    initializeTradeTypeToggle();
    initializePriceSuggestions();
    initializeMarketFilters();
    initializeSimulationControls();
    
    // Update order book periodically
    setInterval(updateOrderBook, 5000);
}

function initializeTradeTypeToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function initializePriceSuggestions() {
    const suggestions = document.querySelectorAll('.price-option');
    const priceInput = document.getElementById('trade-price');

    suggestions.forEach(option => {
        option.addEventListener('click', () => {
            const modifier = option.dataset.modifier;
            if (modifier === 'Market') {
                priceInput.value = getCurrentMarketPrice();
            } else {
                const currentPrice = parseFloat(priceInput.value) || getCurrentMarketPrice();
                const percentage = parseFloat(modifier) / 100;
                priceInput.value = (currentPrice * (1 + percentage)).toFixed(6);
            }
            updateOrderSummary();
        });
    });
}

function initializeMarketFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            filterMarketList(filter.textContent.toLowerCase());
        });
    });
}

function initializeSimulationControls() {
    const conditions = document.querySelectorAll('.condition-btn');
    const periods = document.querySelectorAll('.period-btn');
    const tabs = document.querySelectorAll('.tab-btn');

    [conditions, periods, tabs].forEach(buttons => {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    document.getElementById('run-simulation')?.addEventListener('click', runMarketSimulation);
}

// Test Data Generation
function addTestData() {
    // Add test habits to dashboard
    addTestHabits();
    
    // Initialize charts
    initializeCharts();
    
    // Update order book initially
    updateOrderBook();
}

function addTestHabits() {
    const habitsList = document.getElementById('active-habits');
    if (!habitsList) return;

    const testHabits = [
        { name: 'Daily Meditation', streak: 7, progress: 75 },
        { name: 'Gym Workout', streak: 3, progress: 60 },
        { name: 'Read 30 Minutes', streak: 12, progress: 90 }
    ];

    testHabits.forEach(habit => {
        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card';
        habitCard.innerHTML = `
            <div class="habit-header">
                <h4>${habit.name}</h4>
                <span class="streak">${habit.streak} day streak</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${habit.progress}%"></div>
            </div>
            <div class="habit-footer">
                <span class="completion">${habit.progress}% Complete</span>
                <button class="check-in-btn">Check In</button>
            </div>
        `;
        habitsList.appendChild(habitCard);
    });
}

function initializeCharts() {
    // Market Overview Chart
    const marketCtx = document.getElementById('market-overview-chart')?.getContext('2d');
    if (marketCtx) {
        new Chart(marketCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Market Volume',
                    data: [3.2, 2.8, 3.5, 4.1, 3.8, 3.1, 3.6],
                    borderColor: 'rgb(79, 70, 229)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Asset Price Chart
    const assetCtx = document.getElementById('asset-price-chart')?.getContext('2d');
    if (assetCtx) {
        new Chart(assetCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => i + ':00'),
                datasets: [{
                    label: 'Price',
                    data: generatePriceData(24),
                    borderColor: 'rgb(34, 197, 94)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

function generatePriceData(points) {
    const data = [];
    let price = 0.85;
    for (let i = 0; i < points; i++) {
        price += (Math.random() - 0.5) * 0.02;
        data.push(price);
    }
    return data;
}

function updateOrderBook() {
    const generateOrders = (basePrice, count, type) => {
        const orders = [];
        let price = parseFloat(basePrice);
        for (let i = 0; i < count; i++) {
            const volume = (Math.random() * 5 + 0.1).toFixed(2);
            const change = Math.random() * 0.001;
            price = type === 'bid' ? price - change : price + change;
            const formattedPrice = price.toFixed(6);
            orders.push(`${formattedPrice} ETH - ${volume} units`);
        }
        return orders;
    };

    const basePrice = 0.85;
    const bids = document.getElementById('bids');
    const asks = document.getElementById('asks');

    if (bids && asks) {
        bids.innerHTML = generateOrders(basePrice, 5, 'bid')
            .map(order => `<p>${order}</p>`)
            .join('');
        asks.innerHTML = generateOrders(basePrice, 5, 'ask')
            .map(order => `<p>${order}</p>`)
            .join('');
    }
}

function getCurrentMarketPrice() {
    return 0.85;
}

function updateOrderSummary() {
    const amount = parseFloat(document.getElementById('trade-amount')?.value) || 0;
    const price = parseFloat(document.getElementById('trade-price')?.value) || 0;
    const total = amount * price;
    const fee = total * 0.001;

    document.querySelector('.total-amount').textContent = `${total.toFixed(6)} ETH`;
    document.querySelector('.fee-amount').textContent = `${fee.toFixed(6)} ETH`;
}

function filterMarketList(category) {
    // Implementation for filtering market list by category
    console.log(`Filtering market list by: ${category}`);
}

function runMarketSimulation() {
    const condition = document.querySelector('.condition-btn.active')?.dataset.condition;
    const period = document.querySelector('.period-btn.active')?.dataset.period;
    
    // Implementation for market simulation based on selected condition and period
    console.log(`Running simulation for ${condition} market over ${period}`);
    
    const simulationCtx = document.getElementById('simulation-chart')?.getContext('2d');
    if (simulationCtx) {
        new Chart(simulationCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => i + 1),
                datasets: [{
                    label: 'Token Value',
                    data: generateSimulationData(20, condition),
                    borderColor: 'rgb(79, 70, 229)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

function generateSimulationData(points, condition) {
    const data = [];
    let value = 1.0;
    const volatility = condition === 'volatile' ? 0.1 : 0.03;
    const trend = condition === 'bull' ? 0.02 : condition === 'bear' ? -0.02 : 0;

    for (let i = 0; i < points; i++) {
        value *= (1 + trend + (Math.random() - 0.5) * volatility);
        data.push(value);
    }
    return data;
}

// Token Generation Functions
function generateToken(habit, stake) {
    const prefix = habit.slice(0, 3).toUpperCase();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `TKN-${prefix}-${randomId}`;
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
