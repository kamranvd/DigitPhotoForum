
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); 

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USER,     
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST, // Database host
        dialect: 'mysql',          // Specify MySQL dialect
        logging: false,            // Set to true to see SQL queries in console
        define: {
            timestamps: false,     // Disable default Sequelize timestamps (we handle them manually)
            underscored: true      
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Function to establish database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = {
    sequelize,
    connectDB
};
