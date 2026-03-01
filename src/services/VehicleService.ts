import { VehicleRepository } from '../repositories/VehicleRepository';

export class VehicleService {
    private vehicleRepository: VehicleRepository;

    constructor() {
        this.vehicleRepository = new VehicleRepository();
    }

    async getAllVehicles() {
        return await this.vehicleRepository.findAll();
    }

    async getVehicleById(id: number) {
        return await this.vehicleRepository.findById(id);
    }

    async getVehiclesByClientId(clientId: number) {
        return await this.vehicleRepository.findByClientId(clientId);
    }

    async createVehicle(data: any) {
        return await this.vehicleRepository.create(data);
    }

    async updateVehicle(id: number, data: any) {
        return await this.vehicleRepository.update(id, data);
    }

    async deleteVehicle(id: number) {
        return await this.vehicleRepository.delete(id);
    }
}
