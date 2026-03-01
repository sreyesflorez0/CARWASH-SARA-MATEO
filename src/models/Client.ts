import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Client extends Model {
    public id!: number;
    public name!: string;
    public phone!: string;
    public email!: string;
}

Client.init(
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'clients',
    }
);

export default Client;
