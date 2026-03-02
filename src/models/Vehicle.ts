import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Client from './Client';

class Vehicle extends Model {
    public id!: number;
    public clientId!: number;
    public plate!: string;
    public brand!: string;
    public model!: string;
    public color!: string;
}

Vehicle.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        clientId: {
            type: DataTypes.INTEGER,
            references: {
                model: Client,
                key: 'id',
            },
            allowNull: false,
        },
        plate: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'vehicles',
    }
);

// Associations
Client.hasMany(Vehicle, { foreignKey: 'clientId' });
Vehicle.belongsTo(Client, { foreignKey: 'clientId' });

export default Vehicle;
