import sequelize from './config/database';
import User from './models/User';
import Client from './models/Client';
import Vehicle from './models/Vehicle';
import Service from './models/Service';
import Employee from './models/Employee';
import WashOrder from './models/WashOrder';

const syncDatabase = async () => {
    try {
        // Force models to be loaded (prevents tree-shaking)
        console.log('📦 Loading models:', User.name, Client.name, Vehicle.name, Service.name, Employee.name, WashOrder.name);

        await sequelize.authenticate();
        console.log('✅ Database connected!');
        // Force sync for educational/dev purposes to reset DB easily
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced!');

        // Seed admin user
        await User.create({
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });
        console.log('👤 Admin user created');

        // Seed sample services
        const services = await Promise.all([
            Service.create({ name: 'Lavado Básico', description: 'Lavado exterior con agua y jabón', price: 15000 }),
            Service.create({ name: 'Lavado Completo', description: 'Lavado exterior e interior completo', price: 30000 }),
            Service.create({ name: 'Lavado Premium', description: 'Lavado completo + encerado + aspirado', price: 50000 }),
            Service.create({ name: 'Lavado de Motor', description: 'Limpieza del motor del vehículo', price: 25000 }),
        ]);
        console.log('🧼 Sample services created');

        // Seed sample employees
        const employees = await Promise.all([
            Employee.create({ name: 'Carlos Rodríguez', role: 'Lavador', phone: '3001234567' }),
            Employee.create({ name: 'María López', role: 'Lavador', phone: '3009876543' }),
            Employee.create({ name: 'Juan Pérez', role: 'Supervisor', phone: '3005555555' }),
        ]);
        console.log('👷 Sample employees created');

        // Seed sample clients
        const clients = await Promise.all([
            Client.create({ name: 'Pedro García', phone: '3101111111', email: 'pedro@email.com' }),
            Client.create({ name: 'Ana Martínez', phone: '3102222222', email: 'ana@email.com' }),
        ]);
        console.log('👥 Sample clients created');

        // Seed sample vehicles
        const vehicles = await Promise.all([
            Vehicle.create({ clientId: clients[0].id, plate: 'ABC123', brand: 'Toyota', model: 'Corolla', color: 'Blanco' }),
            Vehicle.create({ clientId: clients[0].id, plate: 'DEF456', brand: 'Honda', model: 'Civic', color: 'Negro' }),
            Vehicle.create({ clientId: clients[1].id, plate: 'GHI789', brand: 'Chevrolet', model: 'Spark', color: 'Rojo' }),
        ]);
        console.log('🚗 Sample vehicles created');

        console.log('✅ Database seeded successfully!');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

syncDatabase();
