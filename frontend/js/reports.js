const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

async function loadData() {
    try {
        // Use Promise.all for concurrent data loading
        const [ordersRes, vehiclesRes, servicesRes, employeesRes] = await Promise.all([
            fetch(`${API_URL}/orders`, { headers }),
            fetch(`${API_URL}/vehicles`, { headers }),
            fetch(`${API_URL}/services`, { headers }),
            fetch(`${API_URL}/employees`, { headers }),
        ]);

        const [orders, vehicles, services, employees] = await Promise.all([
            ordersRes.json(),
            vehiclesRes.json(),
            servicesRes.json(),
            employeesRes.json(),
        ]);

        // Stats
        const completedOrders = orders.filter(o => o.status === 'completed');
        const pendingOrders = orders.filter(o => o.status === 'pending');
        const inProgressOrders = orders.filter(o => o.status === 'in_progress');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
        document.getElementById('completedOrders').textContent = completedOrders.length;
        document.getElementById('pendingOrders').textContent = pendingOrders.length;
        document.getElementById('inProgressOrders').textContent = inProgressOrders.length;

        // Populate dropdowns
        document.getElementById('batchService').innerHTML =
            '<option value="">Seleccione un servicio</option>' +
            services.map(s => `<option value="${s.id}">${s.name} ($${s.price.toLocaleString()})</option>`).join('');

        document.getElementById('batchEmployee').innerHTML =
            '<option value="">Seleccione un empleado</option>' +
            employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

        // Vehicle checkboxes
        const checkboxContainer = document.getElementById('vehicleCheckboxes');
        if (vehicles.length === 0) {
            checkboxContainer.innerHTML = '<p style="color:var(--text-muted);padding:0.5rem;">No hay vehículos registrados</p>';
        } else {
            checkboxContainer.innerHTML = vehicles.map(v => `
                <label style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem;cursor:pointer;border-radius:0.375rem;transition:background 0.15s;"
                    onmouseover="this.style.background='var(--card-hover)'" onmouseout="this.style.background='transparent'">
                    <input type="checkbox" value="${v.id}" style="width:auto;margin:0;">
                    <span style="font-size:0.875rem;">${v.plate} - ${v.brand} ${v.model} ${v.Client ? `(${v.Client.name})` : ''}</span>
                </label>
            `).join('');
        }

        // All orders table
        const tbody = document.getElementById('allOrders');
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:2rem;color:var(--text-muted);">No hay órdenes</td></tr>';
        } else {
            tbody.innerHTML = orders.map(o => `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.Vehicle ? `${o.Vehicle.plate} (${o.Vehicle.brand})` : 'N/A'}</td>
                    <td>${o.Service ? o.Service.name : 'N/A'}</td>
                    <td>${o.Employee ? o.Employee.name : 'N/A'}</td>
                    <td><span class="badge badge-${o.status}">${o.status}</span></td>
                    <td>$${o.totalPrice.toLocaleString()}</td>
                    <td>${new Date(o.date).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function generateBatchOrders() {
    const serviceId = parseInt(document.getElementById('batchService').value);
    const employeeId = parseInt(document.getElementById('batchEmployee').value);
    const checkboxes = document.querySelectorAll('#vehicleCheckboxes input[type="checkbox"]:checked');
    const vehicleIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (!serviceId || !employeeId || vehicleIds.length === 0) {
        alert('Seleccione al menos un vehículo, un servicio y un empleado');
        return;
    }

    const orders = vehicleIds.map(vehicleId => ({
        vehicleId,
        serviceId,
        employeeId,
    }));

    const resultDiv = document.getElementById('batchResult');
    resultDiv.innerHTML = '<div class="loading">Generando órdenes</div>';

    try {
        const response = await fetch(`${API_URL}/orders/batch`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ orders }),
        });

        const results = await response.json();
        resultDiv.innerHTML = `
            <div style="padding:1rem;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:0.75rem;color:var(--success);">
                ✅ Se generaron <strong>${results.length}</strong> órdenes exitosamente usando Promise.all
            </div>
        `;

        // Refresh data
        loadData();
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="padding:1rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:0.75rem;color:var(--danger);">
                ❌ Error al generar órdenes en lote
            </div>
        `;
    }
}

window.generateBatchOrders = generateBatchOrders;

loadData();
