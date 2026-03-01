import { ClientRepository } from '../repositories/ClientRepository';

export class ClientService {
    private clientRepository: ClientRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
    }

    async getAllClients() {
        return await this.clientRepository.findAll();
    }

    async getClientById(id: number) {
        return await this.clientRepository.findById(id);
    }

    async createClient(data: any) {
        return await this.clientRepository.create(data);
    }

    async updateClient(id: number, data: any) {
        return await this.clientRepository.update(id, data);
    }

    async deleteClient(id: number) {
        return await this.clientRepository.delete(id);
    }
}
