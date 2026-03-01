import { Request, Response } from 'express';
import { VehicleService } from '../services/VehicleService';

const vehicleService = new VehicleService();

export const getVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.json(vehicles);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getVehicleById = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.getVehicleById(parseInt(req.params.id));
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getVehiclesByClient = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleService.getVehiclesByClientId(parseInt(req.params.clientId));
        res.json(vehicles);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleService.updateVehicle(parseInt(req.params.id), req.body);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const deleted = await vehicleService.deleteVehicle(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
