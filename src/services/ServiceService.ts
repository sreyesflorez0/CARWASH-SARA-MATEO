import { ServiceRepository } from '../repositories/ServiceRepository';

export class ServiceService {
    private serviceRepository: ServiceRepository;

    constructor() {
        this.serviceRepository = new ServiceRepository();
    }

    async getAllServices() {
        return await this.serviceRepository.findAll();
    }

    async getServiceById(id: number) {
        return await this.serviceRepository.findById(id);
    }

    async createService(data: any) {
        return await this.serviceRepository.create(data);
    }

    async updateService(id: number, data: any) {
        return await this.serviceRepository.update(id, data);
    }

    async deleteService(id: number) {
        return await this.serviceRepository.delete(id);
    }
}
