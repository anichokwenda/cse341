const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { initDb } = require('./db/connect');
require('dotenv').config();

// Swagger - CHANGED THIS LINE
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger'); // <-- load swagger.js which loads swagger.json
console.log("Swagger loaded");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. SERVE PUBLIC FOLDER FIRST
app.use(express.static(path.join(__dirname, 'public')));

// 2. HTML PAGE ROUTE
app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. SWAGGER DOCS - CHANGED THIS LINE
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // <-- use swaggerDocument

// 4. API ROUTES WITH /api PREFIX
app.use('/api', require('./routes'));

// Home page
app.get('/', (req, res) => { res.send('CSE341 Contacts API is running'); });

initDb((err) => {
  if (err) console.log(err);
  else {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  }
});