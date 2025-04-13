// src/app.js
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());

// Swagger Config
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Legal API',
      version: '1.0.0',
      description: 'API para gestión legal de abogados, casos, facturas y más.',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
const lawyerRoutes = require('./routes/lawyerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const searchRoutes = require('./routes/searchRoutes');

const casesRoutes = require('./routes/casesRoutes');	

app.use('/lawyer', lawyerRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/search', searchRoutes);

app.use('/cases', casesRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
