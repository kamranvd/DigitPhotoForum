

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');     // Import User model for association
const Question = require('./question'); // Import Question model for association

const Answer = sequelize.define('Answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Define foreign key relationship
            model: Question,
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
    tableName: 'answers',
    timestamps: false
});

// Define associations
Answer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
// A user can have many answers
User.hasMany(Answer, { foreignKey: 'user_id', as: 'answers' });
// A question can have many answers
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });


module.exports = Answer;
