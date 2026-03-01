import { WashOrderRepository } from '../repositories/WashOrderRepository';
import { ServiceRepository } from '../repositories/ServiceRepository';

export class WashOrderService {
    private washOrderRepository: WashOrderRepository;
    private serviceRepository: ServiceRepository;

    constructor() {
        this.washOrderRepository = new WashOrderRepository();
        this.serviceRepository = new ServiceRepository();
    }

    async getAllOrders() {
        return await this.washOrderRepository.findAll();
    }

    async getOrderById(id: number) {
        return await this.washOrderRepository.findById(id);
    }

    async createOrder(data: any) {
        // Get the service price to set totalPrice
        const service = await this.serviceRepository.findById(data.serviceId);
        if (!service) {
            throw new Error('Service not found');
        }
        data.totalPrice = service.price;
        return await this.washOrderRepository.create(data);
    }

    async updateOrder(id: number, data: any) {
        return await this.washOrderRepository.update(id, data);
    }

    async deleteOrder(id: number) {
        return await this.washOrderRepository.delete(id);
    }

    // Educational: Demonstrate Promise.all for concurrency (batch order creation)
    async createBatchOrders(ordersData: any[]) {
        const results = await Promise.all(
            ordersData.map(async (orderData) => {
                const service = await this.serviceRepository.findById(orderData.serviceId);
                if (!service) return null;

                return await this.washOrderRepository.create({
                    ...orderData,
                    totalPrice: service.price,
                    status: 'pending',
                });
            })
        );

        return results.filter((order) => order !== null);
    }

    async getOrdersByStatus(status: string) {
        return await this.washOrderRepository.findByStatus(status);
    }
}
