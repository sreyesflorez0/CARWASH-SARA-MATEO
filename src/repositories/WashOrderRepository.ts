import WashOrder from '../models/WashOrder';
import Vehicle from '../models/Vehicle';
import Service from '../models/Service';
import Employee from '../models/Employee';

export class WashOrderRepository {
    async findAll() {
        return await WashOrder.findAll({
            include: [Vehicle, Service, Employee],
        });
    }

    async findById(id: number) {
        return await WashOrder.findByPk(id, {
            include: [Vehicle, Service, Employee],
        });
    }

    async create(order: any) {
        return await WashOrder.create(order);
    }

    async update(id: number, data: any) {
        const order = await WashOrder.findByPk(id);
        if (order) {
            return await order.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const order = await WashOrder.findByPk(id);
        if (order) {
            await order.destroy();
            return true;
        }
        return false;
    }

    async findByStatus(status: string) {
        return await WashOrder.findAll({
            where: { status },
            include: [Vehicle, Service, Employee],
        });
    }
}
