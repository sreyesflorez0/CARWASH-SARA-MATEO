import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';

const clientService = new ClientService();

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await clientService.getAllClients();
        res.json(clients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await clientService.getClientById(parseInt(req.params.id));
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createClient = async (req: Request, res: Response) => {
    try {
        const client = await clientService.createClient(req.body);
        res.status(201).json(client);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const client = await clientService.updateClient(parseInt(req.params.id), req.body);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const deleted = await clientService.deleteClient(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
