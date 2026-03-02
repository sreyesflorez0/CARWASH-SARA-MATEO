import { Request, Response } from 'express';
import { WashOrderService } from '../services/WashOrderService';

const washOrderService = new WashOrderService();

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await washOrderService.getAllOrders();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await washOrderService.getOrderById(parseInt(req.params.id));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const order = await washOrderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const order = await washOrderService.updateOrder(parseInt(req.params.id), req.body);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const deleted = await washOrderService.deleteOrder(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Batch order creation using Promise.all
export const createBatchOrders = async (req: Request, res: Response) => {
    try {
        const { orders } = req.body; // Expect array of order objects
        const results = await washOrderService.createBatchOrders(orders);
        res.status(201).json(results);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
    try {
        const orders = await washOrderService.getOrdersByStatus(req.params.status);
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
