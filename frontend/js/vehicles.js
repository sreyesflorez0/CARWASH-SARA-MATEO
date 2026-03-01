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

async function loadClients() {
    const res = await fetch(`${API_URL}/clients`, { headers });
    const clients = await res.json();
    const select = document.getElementById('vehicleClient');
    select.innerHTML = '<option value="">Seleccione un cliente</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function openModal(vehicle = null) {
    loadClients();
    document.getElementById('vehicleModal').style.display = 'block';
    if (vehicle) {
        document.getElementById('modalTitle').textContent = 'Editar Vehículo';
        document.getElementById('vehicleId').value = vehicle.id;
        setTimeout(() => {
            document.getElementById('vehicleClient').value = vehicle.clientId;
        }, 300);
        document.getElementById('vehiclePlate').value = vehicle.plate;
        document.getElementById('vehicleBrand').value = vehicle.brand;
        document.getElementById('vehicleModel').value = vehicle.model;
        document.getElementById('vehicleColor').value = vehicle.color || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Nuevo Vehículo';
        document.getElementById('vehicleForm').reset();
        document.getElementById('vehicleId').value = '';
    }
}

function closeModal() {
    document.getElementById('vehicleModal').style.display = 'none';
}

document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('vehicleId').value;
    const data = {
        clientId: parseInt(document.getElementById('vehicleClient').value),
        plate: document.getElementById('vehiclePlate').value,
        brand: document.getElementById('vehicleBrand').value,
        model: document.getElementById('vehicleModel').value,
        color: document.getElementById('vehicleColor').value,
    };

    try {
        if (id) {
            await fetch(`${API_URL}/vehicles/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
        } else {
            await fetch(`${API_URL}/vehicles`, { method: 'POST', headers, body: JSON.stringify(data) });
        }
        closeModal();
        fetchVehicles();
    } catch (error) {
        alert('Error al guardar vehículo');
    }
});

async function deleteVehicle(id) {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
    try {
        await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE', headers });
        fetchVehicles();
    } catch (error) {
        alert('Error al eliminar vehículo');
    }
}

async function fetchVehicles() {
    try {
        const response = await fetch(`${API_URL}/vehicles`, { headers });
        const vehicles = await response.json();
        const tbody = document.getElementById('vehicleList');

        if (vehicles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:2rem;color:var(--text-muted);">No hay vehículos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = vehicles.map(v => `
            <tr>
                <td>${v.id}</td>
                <td><strong>${v.plate}</strong></td>
                <td>${v.brand}</td>
                <td>${v.model}</td>
                <td>${v.color || '-'}</td>
                <td>${v.Client ? v.Client.name : 'N/A'}</td>
                <td class="actions">
                    <button class="btn btn-success btn-sm" onclick='openModal(${JSON.stringify(v)})'>Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteVehicle(${v.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching vehicles:', error);
    }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.deleteVehicle = deleteVehicle;

fetchVehicles();
