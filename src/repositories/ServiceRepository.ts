import Service from '../models/Service';

export class ServiceRepository {
    async findAll() {
        return await Service.findAll();
    }

    async findById(id: number) {
        return await Service.findByPk(id);
    }

    async create(service: any) {
        return await Service.create(service);
    }

    async update(id: number, data: any) {
        const service = await this.findById(id);
        if (service) {
            return await service.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const service = await this.findById(id);
        if (service) {
            await service.destroy();
            return true;
        }
        return false;
    }
}
