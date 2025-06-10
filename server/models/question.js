

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');       // Import User model for association
const Category = require('./category'); // Import Category model for association

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true // As per your requirement, title can be optional (if content is the main thing)
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Define foreign key relationship
            model: Category,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Define foreign key relationship
            model: User,
            key: 'id'
        }
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
    tableName: 'questions',
    timestamps: false
});

// Define associations
Question.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Question.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
// A user can have many questions
User.hasMany(Question, { foreignKey: 'user_id', as: 'questions' });
// A category can have many questions
Category.hasMany(Question, { foreignKey: 'category_id', as: 'questions' });


module.exports = Question;
