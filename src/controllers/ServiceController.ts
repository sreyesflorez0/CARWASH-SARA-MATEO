import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';

const serviceService = new ServiceService();

export const getServices = async (req: Request, res: Response) => {
    try {
        const services = await serviceService.getAllServices();
        res.json(services);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    try {
        const service = await serviceService.getServiceById(parseInt(req.params.id));
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (data.price) {
            data.price = parseFloat(data.price);
        }
        const service = await serviceService.createService(data);
        res.status(201).json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (data.price) {
            data.price = parseFloat(data.price);
        }
        const service = await serviceService.updateService(parseInt(req.params.id), data);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const deleted = await serviceService.deleteService(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
