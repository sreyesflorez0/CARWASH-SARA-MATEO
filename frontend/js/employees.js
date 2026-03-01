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

function openModal(employee = null) {
    document.getElementById('employeeModal').style.display = 'block';
    if (employee) {
        document.getElementById('modalTitle').textContent = 'Editar Empleado';
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeeRole').value = employee.role;
        document.getElementById('employeePhone').value = employee.phone || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Nuevo Empleado';
        document.getElementById('employeeForm').reset();
        document.getElementById('employeeId').value = '';
    }
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('employeeId').value;
    const data = {
        name: document.getElementById('employeeName').value,
        role: document.getElementById('employeeRole').value,
        phone: document.getElementById('employeePhone').value,
    };

    try {
        if (id) {
            await fetch(`${API_URL}/employees/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
        } else {
            await fetch(`${API_URL}/employees`, { method: 'POST', headers, body: JSON.stringify(data) });
        }
        closeModal();
        fetchEmployees();
    } catch (error) {
        alert('Error al guardar empleado');
    }
});

async function deleteEmployee(id) {
    if (!confirm('¿Está seguro de eliminar este empleado?')) return;
    try {
        await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE', headers });
        fetchEmployees();
    } catch (error) {
        alert('Error al eliminar empleado');
    }
}

async function fetchEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`, { headers });
        const employees = await response.json();
        const container = document.getElementById('employeeList');

        if (employees.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">👷</div><p>No hay empleados registrados</p></div>';
            return;
        }

        container.innerHTML = employees.map(e => `
            <div class="card">
                <h3>👷 ${e.name}</h3>
                <p><strong>Cargo:</strong> ${e.role}</p>
                <p><strong>Teléfono:</strong> ${e.phone || 'No registrado'}</p>
                <div class="card-actions">
                    <button class="btn btn-success btn-sm" onclick='openModal(${JSON.stringify(e)})'>Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${e.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.deleteEmployee = deleteEmployee;

fetchEmployees();
