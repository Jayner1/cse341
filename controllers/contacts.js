const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  favoriteColor: String,
  birthday: String,
});

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

// POST
router.post('/', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newContact = new Contact({ firstName, lastName, email, favoriteColor, birthday });
    const savedContact = await newContact.save();
    res.status(201).json({ message: "Contact created successfully", id: savedContact._id });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "An error occurred while creating the contact." });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ message: "All fields are required to update the contact." });
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.email = email;
    contact.favoriteColor = favoriteColor;
    contact.birthday = birthday;

    const updatedContact = await contact.save();
    res.status(204).json({ message: "Contact updated successfully", contact: updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "An error occurred while updating the contact." });
  }
});

// GET all contacts
const getAll = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(); // Select the database
    const contacts = await db.collection('contacts').find().toArray(); // Fetch contacts from the collection
    res.status(200).json(contacts); // Return the contacts as a JSON response
    client.close(); // Close the connection
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "An error occurred while retrieving contacts." });
  }
};

// GET single contact
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "An error occurred while retrieving the contact." });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "An error occurred while deleting the contact." });
  }
});

// Export the controller methods
module.exports = {
  getAll,
  createContact: router.post('/'),
  updateContact: router.put('/:id'),
  getSingle: router.get('/:id'),
  deleteContact: router.delete('/:id')
};
