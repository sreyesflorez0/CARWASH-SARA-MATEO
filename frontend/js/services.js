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

function openModal(service = null) {
    document.getElementById('serviceModal').style.display = 'block';
    if (service) {
        document.getElementById('modalTitle').textContent = 'Editar Servicio';
        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceDescription').value = service.description || '';
        document.getElementById('servicePrice').value = service.price;
    } else {
        document.getElementById('modalTitle').textContent = 'Nuevo Servicio';
        document.getElementById('serviceForm').reset();
        document.getElementById('serviceId').value = '';
    }
}

function closeModal() {
    document.getElementById('serviceModal').style.display = 'none';
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('serviceId').value;
    const data = {
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value),
    };

    try {
        if (id) {
            await fetch(`${API_URL}/services/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
        } else {
            await fetch(`${API_URL}/services`, { method: 'POST', headers, body: JSON.stringify(data) });
        }
        closeModal();
        fetchServices();
    } catch (error) {
        alert('Error al guardar servicio');
    }
});

async function deleteService(id) {
    if (!confirm('¿Está seguro de eliminar este servicio?')) return;
    try {
        await fetch(`${API_URL}/services/${id}`, { method: 'DELETE', headers });
        fetchServices();
    } catch (error) {
        alert('Error al eliminar servicio');
    }
}

async function fetchServices() {
    try {
        const response = await fetch(`${API_URL}/services`, { headers });
        const services = await response.json();
        const container = document.getElementById('serviceList');

        if (services.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">🧼</div><p>No hay servicios registrados</p></div>';
            return;
        }

        container.innerHTML = services.map(s => `
            <div class="card">
                <h3>🧼 ${s.name}</h3>
                <p>${s.description || 'Sin descripción'}</p>
                <p style="font-size:1.25rem;font-weight:700;color:var(--primary-color);margin-top:0.75rem;">$${s.price.toLocaleString()}</p>
                <div class="card-actions">
                    <button class="btn btn-success btn-sm" onclick='openModal(${JSON.stringify(s)})'>Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${s.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.deleteService = deleteService;

fetchServices();
