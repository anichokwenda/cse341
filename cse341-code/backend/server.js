const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/connect');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', require('./routes'));

app.get('/', (req, res) => { res.send('CSE341 Contacts API is running'); });

initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});