import { Router } from 'express';
import { login } from '../controllers/AuthController';
import { getClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/ClientController';
import { getVehicles, getVehicleById, getVehiclesByClient, createVehicle, updateVehicle, deleteVehicle } from '../controllers/VehicleController';
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/ServiceController';
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from '../controllers/EmployeeController';
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, createBatchOrders, getOrdersByStatus } from '../controllers/WashOrderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth (public)
router.post('/login', login);

// Clients
router.get('/clients', authMiddleware, getClients);
router.get('/clients/:id', authMiddleware, getClientById);
router.post('/clients', authMiddleware, createClient);
router.put('/clients/:id', authMiddleware, updateClient);
router.delete('/clients/:id', authMiddleware, deleteClient);

// Vehicles
router.get('/vehicles', authMiddleware, getVehicles);
router.get('/vehicles/:id', authMiddleware, getVehicleById);
router.get('/vehicles/client/:clientId', authMiddleware, getVehiclesByClient);
router.post('/vehicles', authMiddleware, createVehicle);
router.put('/vehicles/:id', authMiddleware, updateVehicle);
router.delete('/vehicles/:id', authMiddleware, deleteVehicle);

// Services
router.get('/services', authMiddleware, getServices);
router.get('/services/:id', authMiddleware, getServiceById);
router.post('/services', authMiddleware, createService);
router.put('/services/:id', authMiddleware, updateService);
router.delete('/services/:id', authMiddleware, deleteService);

// Employees
router.get('/employees', authMiddleware, getEmployees);
router.get('/employees/:id', authMiddleware, getEmployeeById);
router.post('/employees', authMiddleware, createEmployee);
router.put('/employees/:id', authMiddleware, updateEmployee);
router.delete('/employees/:id', authMiddleware, deleteEmployee);

// Wash Orders
router.get('/orders', authMiddleware, getOrders);
router.get('/orders/:id', authMiddleware, getOrderById);
router.get('/orders/status/:status', authMiddleware, getOrdersByStatus);
router.post('/orders', authMiddleware, createOrder);
router.post('/orders/batch', authMiddleware, createBatchOrders);
router.put('/orders/:id', authMiddleware, updateOrder);
router.delete('/orders/:id', authMiddleware, deleteOrder);

export default router;
