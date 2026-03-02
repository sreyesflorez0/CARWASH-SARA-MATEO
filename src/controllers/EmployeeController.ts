import { Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';

const employeeService = new EmployeeService();

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.getEmployeeById(parseInt(req.params.id));
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.updateEmployee(parseInt(req.params.id), req.body);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const deleted = await employeeService.deleteEmployee(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
