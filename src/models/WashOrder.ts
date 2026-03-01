import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Vehicle from './Vehicle';
import Service from './Service';
import Employee from './Employee';

class WashOrder extends Model {
    public id!: number;
    public vehicleId!: number;
    public serviceId!: number;
    public employeeId!: number;
    public status!: string;
    public date!: Date;
    public totalPrice!: number;
}

WashOrder.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        vehicleId: {
            type: DataTypes.INTEGER,
            references: {
                model: Vehicle,
                key: 'id',
            },
            allowNull: false,
        },
        serviceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Service,
                key: 'id',
            },
            allowNull: false,
        },
        employeeId: {
            type: DataTypes.INTEGER,
            references: {
                model: Employee,
                key: 'id',
            },
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
            defaultValue: 'pending',
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'wash_orders',
    }
);

// Associations
Vehicle.hasMany(WashOrder, { foreignKey: 'vehicleId' });
WashOrder.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

Service.hasMany(WashOrder, { foreignKey: 'serviceId' });
WashOrder.belongsTo(Service, { foreignKey: 'serviceId' });

Employee.hasMany(WashOrder, { foreignKey: 'employeeId' });
WashOrder.belongsTo(Employee, { foreignKey: 'employeeId' });

export default WashOrder;
