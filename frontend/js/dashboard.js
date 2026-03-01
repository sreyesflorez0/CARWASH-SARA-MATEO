const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

const headers = { 'Authorization': `Bearer ${token}` };

async function loadDashboard() {
    try {
        // Use Promise.all to fetch all data concurrently
        const [clientsRes, vehiclesRes, ordersRes] = await Promise.all([
            fetch(`${API_URL}/clients`, { headers }),
            fetch(`${API_URL}/vehicles`, { headers }),
            fetch(`${API_URL}/orders`, { headers }),
        ]);

        const [clients, vehicles, orders] = await Promise.all([
            clientsRes.json(),
            vehiclesRes.json(),
            ordersRes.json(),
        ]);

        document.getElementById('totalClients').textContent = clients.length;
        document.getElementById('totalVehicles').textContent = vehicles.length;
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending').length;

        // Show recent orders (last 10)
        const recentOrders = orders.slice(-10).reverse();
        const tbody = document.getElementById('recentOrders');

        if (recentOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:2rem;color:var(--text-muted);">No hay órdenes registradas</td></tr>';
            return;
        }

        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.Vehicle ? `${order.Vehicle.brand} ${order.Vehicle.model} (${order.Vehicle.plate})` : 'N/A'}</td>
                <td>${order.Service ? order.Service.name : 'N/A'}</td>
                <td>${order.Employee ? order.Employee.name : 'N/A'}</td>
                <td><span class="badge badge-${order.status}">${order.status}</span></td>
                <td>$${order.totalPrice.toLocaleString()}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

loadDashboard();
