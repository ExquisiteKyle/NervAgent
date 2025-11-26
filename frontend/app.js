// Demo App Logic
let currentPage = 'home';
let tasks = [];
let appState = {
    currentPage: 'home',
    actions: [],
    featuresUsed: []
};

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const page = e.target.dataset.page;
        switchPage(page);
        trackFeature('navigation');
    });
});

const switchPage = (page) => {
    currentPage = page;
    appState.currentPage = page;
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    const content = document.getElementById('page-content');
    content.innerHTML = `<p>You are now on the ${page} page.</p>`;
    
    trackAction(`navigate_to_${page}`);
}

// Task List
document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    const task = input.value.trim();
    if (!task) return;
    
    tasks.push(task);
    input.value = '';
    renderTasks();
    trackFeature('task-list');
    trackAction('add_task');
});

const renderTasks = () => {
    document.getElementById('task-list').innerHTML = tasks.map((task, index) => `
        <li>
            <span>${task}</span>
            <button onclick="deleteTask(${index})">Delete</button>
        </li>
    `).join('');
}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
    trackAction('delete_task');
}

// Calculator
document.getElementById('calculate-btn').addEventListener('click', () => {
    const num1 = parseFloat(document.getElementById('calc-input-1').value);
    const num2 = parseFloat(document.getElementById('calc-input-2').value);
    const operator = document.getElementById('calc-operator').value;
    
    if (isNaN(num1) || isNaN(num2)) {
        return alert('Please enter valid numbers');
    }
    
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };
    
    const result = operations[operator](num1, num2);
    
    document.getElementById('calc-result').textContent = `Result: ${result}`;
    trackFeature('calculator');
    trackAction('calculate');
});

// Settings
document.getElementById('save-settings-btn').addEventListener('click', () => {
    const darkMode = document.getElementById('dark-mode').checked;
    const notifications = document.getElementById('notifications').checked;
    
    alert(`Settings saved!\nDark Mode: ${darkMode}\nNotifications: ${notifications}`);
    trackFeature('settings');
    trackAction('save_settings');
});

// Tracking functions
const trackFeature = (feature) => 
    appState.featuresUsed.includes(feature) || appState.featuresUsed.push(feature);

const trackAction = (action) => appState.actions.push(action);

// Make deleteTask available globally
window.deleteTask = deleteTask;

