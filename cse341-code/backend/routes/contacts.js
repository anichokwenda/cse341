const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const router = express.Router();

// GET /contacts - Get all contacts
router.get('/', async (req, res) => {
  try {
    const result = await getDb().collection('contacts').find();
    const contacts = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /contacts/:id - Get one contact
router.get('/:id', async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const result = await getDb().collection('contacts').findOne({ _id: contactId });
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