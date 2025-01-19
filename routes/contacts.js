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


router.get('/', async (req, res) => {
    console.log('Fetching contacts...');
    try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "An error occurred while retrieving contacts." });
    }
  });

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

module.exports = router;
