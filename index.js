require('dotenv').config();
const express = require('express');
const {connectDB} = require('./src/config/database');
const {syncDatabase} = require('./src/models');
const corsMiddleware = require('./src/middleware/cors');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(corsMiddleware);

// Swagger setup
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

(async () => {
  try {
    await connectDB();
    await syncDatabase();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Error inicializando la app:', err);
  }
})();