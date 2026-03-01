import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Service extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
}

Service.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'services',
    }
);

export default Service;
