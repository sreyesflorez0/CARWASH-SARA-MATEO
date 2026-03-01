import Client from '../models/Client';

export class ClientRepository {
    async findAll() {
        return await Client.findAll();
    }

    async findById(id: number) {
        return await Client.findByPk(id);
    }

    async create(client: any) {
        return await Client.create(client);
    }

    async update(id: number, data: any) {
        const client = await this.findById(id);
        if (client) {
            return await client.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const client = await this.findById(id);
        if (client) {
            await client.destroy();
            return true;
        }
        return false;
    }
}
