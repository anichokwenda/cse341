const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const router = express.Router();

// GET /contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    console.log('DB Name:', db.databaseName);
    
    const result = await db.collection('contacts').find();
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
    const id = req.params.id;

    // 1. Validate ID format first
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact ID format. Must be 24 hex characters.' });
    }

    const contactId = new ObjectId(id);
    const result = await getDb().collection('contacts').findOne({ _id: contactId });
    
    // 2. Check if we found anything
    if (!result) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result); // This returns 1 object, not array
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;