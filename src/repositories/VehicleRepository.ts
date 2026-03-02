import Vehicle from '../models/Vehicle';
import Client from '../models/Client';

export class VehicleRepository {
    async findAll() {
        return await Vehicle.findAll({ include: [Client] });
    }

    async findById(id: number) {
        return await Vehicle.findByPk(id, { include: [Client] });
    }

    async findByClientId(clientId: number) {
        return await Vehicle.findAll({ where: { clientId } });
    }

    async create(vehicle: any) {
        return await Vehicle.create(vehicle);
    }

    async update(id: number, data: any) {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            return await vehicle.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            await vehicle.destroy();
            return true;
        }
        return false;
    }
}
