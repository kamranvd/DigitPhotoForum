const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the configured sequelize instance

const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING, // Hashed password will be stored here
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'users', // Specify the actual table name in MySQL
    timestamps: false   // Disable Sequelize's default `createdAt` and `updatedAt` columns
                        
});

module.exports = User;
