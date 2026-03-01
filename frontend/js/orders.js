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

async function loadDropdowns() {
    // Use Promise.all for concurrent loading
    const [vehiclesRes, servicesRes, employeesRes] = await Promise.all([
        fetch(`${API_URL}/vehicles`, { headers }),
        fetch(`${API_URL}/services`, { headers }),
        fetch(`${API_URL}/employees`, { headers }),
    ]);

    const [vehicles, services, employees] = await Promise.all([
        vehiclesRes.json(),
        servicesRes.json(),
        employeesRes.json(),
    ]);

    document.getElementById('orderVehicle').innerHTML =
        '<option value="">Seleccione un vehículo</option>' +
        vehicles.map(v => `<option value="${v.id}">${v.plate} - ${v.brand} ${v.model}</option>`).join('');

    document.getElementById('orderService').innerHTML =
        '<option value="">Seleccione un servicio</option>' +
        services.map(s => `<option value="${s.id}">${s.name} ($${s.price.toLocaleString()})</option>`).join('');

    document.getElementById('orderEmployee').innerHTML =
        '<option value="">Seleccione un empleado</option>' +
        employees.map(e => `<option value="${e.id}">${e.name} (${e.role})</option>`).join('');
}

function openModal(order = null) {
    loadDropdowns();
    document.getElementById('orderModal').style.display = 'block';
    if (order) {
        document.getElementById('modalTitle').textContent = 'Editar Orden';
        document.getElementById('orderId').value = order.id;
        document.getElementById('statusGroup').style.display = 'block';
        setTimeout(() => {
            document.getElementById('orderVehicle').value = order.vehicleId;
            document.getElementById('orderService').value = order.serviceId;
            document.getElementById('orderEmployee').value = order.employeeId;
            document.getElementById('orderStatus').value = order.status;
        }, 300);
    } else {
        document.getElementById('modalTitle').textContent = 'Nueva Orden';
        document.getElementById('orderForm').reset();
        document.getElementById('orderId').value = '';
        document.getElementById('statusGroup').style.display = 'none';
    }
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('orderId').value;
    const data = {
        vehicleId: parseInt(document.getElementById('orderVehicle').value),
        serviceId: parseInt(document.getElementById('orderService').value),
        employeeId: parseInt(document.getElementById('orderEmployee').value),
    };

    if (id) {
        data.status = document.getElementById('orderStatus').value;
    }

    try {
        if (id) {
            await fetch(`${API_URL}/orders/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
        } else {
            await fetch(`${API_URL}/orders`, { method: 'POST', headers, body: JSON.stringify(data) });
        }
        closeModal();
        fetchOrders();
    } catch (error) {
        alert('Error al guardar orden');
    }
});

async function deleteOrder(id) {
    if (!confirm('¿Está seguro de eliminar esta orden?')) return;
    try {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE', headers });
        fetchOrders();
    } catch (error) {
        alert('Error al eliminar orden');
    }
}

async function updateStatus(id, status) {
    try {
        await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ status })
        });
        fetchOrders();
    } catch (error) {
        alert('Error al actualizar estado');
    }
}

async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, { headers });
        const orders = await response.json();
        const tbody = document.getElementById('orderList');

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="padding:2rem;color:var(--text-muted);">No hay órdenes registradas</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.Vehicle ? `${o.Vehicle.plate} (${o.Vehicle.brand})` : 'N/A'}</td>
                <td>${o.Service ? o.Service.name : 'N/A'}</td>
                <td>${o.Employee ? o.Employee.name : 'N/A'}</td>
                <td><span class="badge badge-${o.status}">${o.status}</span></td>
                <td>$${o.totalPrice.toLocaleString()}</td>
                <td>${new Date(o.date).toLocaleDateString()}</td>
                <td class="actions">
                    ${o.status === 'pending' ? `<button class="btn btn-warning btn-sm" onclick="updateStatus(${o.id}, 'in_progress')">Iniciar</button>` : ''}
                    ${o.status === 'in_progress' ? `<button class="btn btn-success btn-sm" onclick="updateStatus(${o.id}, 'completed')">Completar</button>` : ''}
                    <button class="btn btn-danger btn-sm" onclick="deleteOrder(${o.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.deleteOrder = deleteOrder;
window.updateStatus = updateStatus;

fetchOrders();
