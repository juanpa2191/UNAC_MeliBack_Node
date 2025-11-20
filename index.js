require('dotenv').config();
const express = require('express');
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


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});