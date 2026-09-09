const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const router = express.Router();

/**
 * @swagger
 * /api/contacts:
 * get:
 * summary: Get all contacts
 * tags: [Contacts]
 * responses:
 * 200:
 * description: List of all contacts
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 */
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

/**
 * @swagger
 * /api/contacts/{id}:
 * get:
 * summary: Get one contact by ID
 * tags: [Contacts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Contact ID
 * responses:
 * 200:
 * description: A single contact
 * 404:
 * description: Contact not found
 * 400:
 * description: Invalid ID format
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact ID format. Must be 24 hex characters.' });
    }
    const contactId = new ObjectId(id);
    const result = await getDb().collection('contacts').findOne({ _id: contactId });
    if (!result) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/contacts:
 * post:
 * summary: Create a new contact
 * tags: [Contacts]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - firstName
 * - lastName
 * - email
 * - favoriteColor
 * - birthday
 * properties:
 * firstName:
 * type: string
 * lastName:
 * type: string
 * email:
 * type: string
 * favoriteColor:
 * type: string
 * birthday:
 * type: string
 * format: date
 * responses:
 * 201:
 * description: Contact created successfully
 * 400:
 * description: Missing required fields
 */
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName ||!lastName ||!email ||!favoriteColor ||!birthday) {
      return res.status(400).json({ message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' });
    }
    const newContact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await getDb().collection('contacts').insertOne(newContact);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 * put:
 * summary: Update a contact by ID
 * tags: [Contacts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * responses:
 * 204:
 * description: Contact updated successfully
 * 404:
 * description: Contact not found
 * 400:
 * description: Invalid ID or missing fields
 */
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact ID format. Must be 24 hex characters.' });
    }
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    if (!firstName ||!lastName ||!email ||!favoriteColor ||!birthday) {
      return res.status(400).json({ message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' });
    }
    const contactId = new ObjectId(id);
    const updatedContact = { firstName, lastName, email, favoriteColor, birthday };
    const result = await getDb().collection('contacts').replaceOne({ _id: contactId }, updatedContact);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 * delete:
 * summary: Delete a contact by ID
 * tags: [Contacts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Contact deleted successfully
 * 404:
 * description: Contact not found
 * 400:
 * description: Invalid ID format
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact ID format. Must be 24 hex characters.' });
    }
    const contactId = new ObjectId(id);
    const result = await getDb().collection('contacts').deleteOne({ _id: contactId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).send();
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;