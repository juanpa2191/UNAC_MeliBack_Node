const {sequelize} = require('../config/database');
const Product = require('./Product');

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Use { force: true } to drop and recreate tables
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = { Product, syncDatabase };