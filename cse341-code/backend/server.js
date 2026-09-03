const express = require('express');
const cors = require('cors');
const path = require('path'); 
const { initDb } = require('./db/connect');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. SERVE PUBLIC FOLDER FIRST
app.use(express.static(path.join(__dirname, 'public')));

// 2. /contacts PAGE 
app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. API ROUTES WITH /api PREFIX
app.use('/api', require('./routes')); // <-- CHANGED HERE

// Home page
app.get('/', (req, res) => { res.send('CSE341 Contacts API is running'); });

initDb((err) => {
  if (err) console.log(err);
  else {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on http://localhost:${port}/contacts`));
  }
});