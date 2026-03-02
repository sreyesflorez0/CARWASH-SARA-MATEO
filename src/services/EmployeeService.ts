import { EmployeeRepository } from '../repositories/EmployeeRepository';

export class EmployeeService {
    private employeeRepository: EmployeeRepository;

    constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    async getAllEmployees() {
        return await this.employeeRepository.findAll();
    }

    async getEmployeeById(id: number) {
        return await this.employeeRepository.findById(id);
    }

    async createEmployee(data: any) {
        return await this.employeeRepository.create(data);
    }

    async updateEmployee(id: number, data: any) {
        return await this.employeeRepository.update(id, data);
    }

    async deleteEmployee(id: number) {
        return await this.employeeRepository.delete(id);
    }
}
