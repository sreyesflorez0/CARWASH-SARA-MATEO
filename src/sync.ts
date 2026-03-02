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
        // Alter sync to update tables without dropping data
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced!');

        // Only seed data if SEED_DB env var is set to 'true'
        if (process.env.SEED_DB === 'true') {
            console.log('🌱 Seeding database...');

            // Seed admin user (findOrCreate to avoid duplicates on re-deploys)
            const [adminUser, adminCreated] = await User.findOrCreate({
                where: { username: 'admin' },
                defaults: {
                    username: 'admin',
                    password: 'password123',
                    role: 'admin'
                }
            });
            console.log(adminCreated ? '👤 Admin user created' : '👤 Admin user already exists');

            // Seed sample services
            const serviceData = [
                { name: 'Lavado Básico', description: 'Lavado exterior con agua y jabón', price: 15000 },
                { name: 'Lavado Completo', description: 'Lavado exterior e interior completo', price: 30000 },
                { name: 'Lavado Premium', description: 'Lavado completo + encerado + aspirado', price: 50000 },
                { name: 'Lavado de Motor', description: 'Limpieza del motor del vehículo', price: 25000 },
            ];
            for (const s of serviceData) {
                await Service.findOrCreate({ where: { name: s.name }, defaults: s });
            }
            console.log('🧼 Sample services ready');

            // Seed sample employees
            const employeeData = [
                { name: 'Carlos Rodríguez', role: 'Lavador', phone: '3001234567' },
                { name: 'María López', role: 'Lavador', phone: '3009876543' },
                { name: 'Juan Pérez', role: 'Supervisor', phone: '3005555555' },
            ];
            for (const e of employeeData) {
                await Employee.findOrCreate({ where: { name: e.name }, defaults: e });
            }
            console.log('👷 Sample employees ready');

            // Seed sample clients
            const clientData = [
                { name: 'Pedro García', phone: '3101111111', email: 'pedro@email.com' },
                { name: 'Ana Martínez', phone: '3102222222', email: 'ana@email.com' },
            ];
            const createdClients = [];
            for (const c of clientData) {
                const [client] = await Client.findOrCreate({ where: { name: c.name }, defaults: c });
                createdClients.push(client);
            }
            console.log('👥 Sample clients ready');

            // Seed sample vehicles
            const vehicleData = [
                { clientId: createdClients[0].id, plate: 'ABC123', brand: 'Toyota', model: 'Corolla', color: 'Blanco' },
                { clientId: createdClients[0].id, plate: 'DEF456', brand: 'Honda', model: 'Civic', color: 'Negro' },
                { clientId: createdClients[1].id, plate: 'GHI789', brand: 'Chevrolet', model: 'Spark', color: 'Rojo' },
            ];
            for (const v of vehicleData) {
                await Vehicle.findOrCreate({ where: { plate: v.plate }, defaults: v });
            }
            console.log('🚗 Sample vehicles ready');

            console.log('✅ Database seeded successfully!');
        } else {
            console.log('⏭️  Skipping seed (set SEED_DB=true to seed)');
        }

        // Close connection so the process can exit
        await sequelize.close();
        console.log('✅ Sync complete, connection closed.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

syncDatabase();
