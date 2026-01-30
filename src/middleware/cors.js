const cors = require('cors');

const corsOptions = {
  origin: 'https://unac-meli-front-hugxbkd3e7andycp.canadacentral-01.azurewebsites.net', // Allow specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
module.exports = cors(corsOptions);