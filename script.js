// Function to load content dynamically
function loadContent(content) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = content;
}

// Event Listeners for Navigation Links
document.getElementById('dashboard-link').addEventListener('click', function() {
    loadContent(`
        <div class="content-header">
            <h1>Dashboard</h1>
            <p>Overview of your inventory and reports.</p>
        </div>
        <div class="dashboard-stats">
            <div class="stat-card">
                <h3>Total Items</h3>
                <p id="total-items"></p>
            </div>
            <div class="stat-card">
                <h3>Total Value</h3>
                <p id="total-value"></p>
            </div>
        </div>
        <div class="recent-activities">
            <h2>Recent Activities</h2>
            <ul id="recent-activity-list"></ul>
        </div>
    `);
    updateDashboardStats();
});

document.getElementById('inventory-link').addEventListener('click', function() {
    loadContent(`
        <div class="content-header">
            <h1>Inventory Management</h1>
            <p>Manage your restaurant's inventory easily.</p>
        </div>
        <div class="form-container">
            <form id="inventory-form">
                <div class="row">
                    <div class="col-md-4">
                        <input type="text" id="itemName" class="form-control" placeholder="Item Name" required>
                    </div>
                    <div class="col-md-4">
                        <input type="number" id="itemQuantity" class="form-control" placeholder="Quantity" required>
                    </div>
                    <div class="col-md-4">
                        <input type="number" id="itemPrice" class="form-control" placeholder="Unit Price" required>
                    </div>
                    <div class="col-md-4 mt-3">
                        <button type="submit" class="btn btn-primary w-100">Add Item</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="inventory-table">
            <div class="table-container">
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="inventory-body">
                        <!-- Inventory Items will be dynamically added here -->
                    </tbody>
                </table>
            </div>
        </div>
    `);
    renderInventory();
});

document.getElementById('reports-link').addEventListener('click', function() {
    loadContent(`
        <div class="content-header">
            <h1>Reports</h1>
            <p>View detailed reports of your inventory usage and costs.</p>
        </div>
        <div class="reports-section">
            <h2>Generate Reports</h2>
            <button class="btn btn-secondary" onclick="generateReport()">Generate Inventory Report</button>
            <div id="report-result" class="report-result"></div>
        </div>
    `);
});

document.getElementById('settings-link').addEventListener('click', function() {
    loadContent(`
        <div class="content-header">
            <h1>Settings</h1>
            <p>Configure system preferences and user settings.</p>
        </div>
        <div class="settings-section">
            <h2>User Settings</h2>
            <form id="settings-form">
                <label for="username">Username:</label>
                <input type="text" id="username" class="form-control" value="${localStorage.getItem('username') || ''}">
                <label for="theme">Theme:</label>
                <select id="theme" class="form-control">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
                <button type="submit" class="btn btn-primary mt-3">Save Settings</button>
            </form>
        </div>
    `);
    loadUserSettings();
});

// Inventory management functions
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function renderInventory() {
    const tbody = document.getElementById('inventory-body');
    if (tbody) {
        tbody.innerHTML = '';
        inventory.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
                <td>
                    <i class="fa fa-edit edit-btn" onclick="editItem(${index})"></i> |
                    <i class="fa fa-trash delete-btn" onclick="deleteItem(${index})"></i>
                </td>
            `;
            tbody.appendChild(row);
        });
        localStorage.setItem('inventory', JSON.stringify(inventory)); // Save data to localStorage
    }
}

document.addEventListener('submit', function(event) {
    if (event.target.id === 'inventory-form') {
        event.preventDefault();
        const name = document.getElementById('itemName').value.trim();
        const quantity = parseFloat(document.getElementById('itemQuantity').value);
        const price = parseFloat(document.getElementById('itemPrice').value);

        if (name && quantity > 0 && price > 0) {
            inventory.push({ name, quantity, price });
            renderInventory();
            updateDashboardStats(); // Update dashboard stats immediately
            event.target.reset();
        } else {
            alert("Please enter valid item details.");
        }
    }
});

// Dashboard statistics
function updateDashboardStats() {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);

    document.getElementById('total-items').innerText = totalItems;
    document.getElementById('total-value').innerText = totalValue;

    const recentActivityList = document.getElementById('recent-activity-list');
    recentActivityList.innerHTML = inventory.slice(-3).map(item => `<li>Added ${item.name} (Qty: ${item.quantity})</li>`).join('');
}

// Reports section
function generateReport() {
    let reportHtml = `<h3>Inventory Report</h3>`;
    reportHtml += `<p>Total Items: ${inventory.length}</p>`;
    reportHtml += `<p>Total Inventory Value: $${inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</p>`;
    
    reportHtml += '<ul>';
    inventory.forEach(item => {
        reportHtml += `<li>${item.name} - ${item.quantity} units @ $${item.price} each</li>`;
    });
    reportHtml += '</ul>';

    document.getElementById('report-result').innerHTML = reportHtml;
}

// Settings functionality
function loadUserSettings() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);

    document.getElementById('theme').value = savedTheme;
    document.getElementById('settings-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const theme = document.getElementById('theme').value;

        localStorage.setItem('username', username);
        localStorage.setItem('theme', theme);

        // Update the theme on the fly
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);

        alert('Settings saved successfully!');
    });
}
