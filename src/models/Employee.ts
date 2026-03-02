import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Employee extends Model {
    public id!: number;
    public name!: string;
    public role!: string;
    public phone!: string;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'employees',
    }
);

export default Employee;
