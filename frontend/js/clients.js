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

function openModal(client = null) {
    document.getElementById('clientModal').style.display = 'block';
    if (client) {
        document.getElementById('modalTitle').textContent = 'Editar Cliente';
        document.getElementById('clientId').value = client.id;
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientPhone').value = client.phone;
        document.getElementById('clientEmail').value = client.email || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Nuevo Cliente';
        document.getElementById('clientForm').reset();
        document.getElementById('clientId').value = '';
    }
}

function closeModal() {
    document.getElementById('clientModal').style.display = 'none';
}

document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('clientId').value;
    const data = {
        name: document.getElementById('clientName').value,
        phone: document.getElementById('clientPhone').value,
        email: document.getElementById('clientEmail').value,
    };

    try {
        if (id) {
            await fetch(`${API_URL}/clients/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
        } else {
            await fetch(`${API_URL}/clients`, { method: 'POST', headers, body: JSON.stringify(data) });
        }
        closeModal();
        fetchClients();
    } catch (error) {
        alert('Error al guardar cliente');
    }
});

async function deleteClient(id) {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    try {
        await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE', headers });
        fetchClients();
    } catch (error) {
        alert('Error al eliminar cliente');
    }
}

async function fetchClients() {
    try {
        const response = await fetch(`${API_URL}/clients`, { headers });
        const clients = await response.json();
        const tbody = document.getElementById('clientList');

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:2rem;color:var(--text-muted);">No hay clientes registrados</td></tr>';
            return;
        }

        tbody.innerHTML = clients.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.email || '-'}</td>
                <td class="actions">
                    <button class="btn btn-success btn-sm" onclick='openModal(${JSON.stringify(c)})'>Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;
window.deleteClient = deleteClient;

fetchClients();
