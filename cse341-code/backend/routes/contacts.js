const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const router = express.Router();

// GET /contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    console.log('DB Name:', db.databaseName);
    
    const result = await db.collection('contacts').find(); // back to 'contacts'
    const contacts = await result.toArray();
    console.log('Found contacts:', contacts.length);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /contacts/:id - Get one contact
router.get('/:id', async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const result = await getDb().collection('contacts').findOne({ _id: contactId }); // back to 'contacts'
    if (!result) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;