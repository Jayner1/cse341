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

//POST
router.post('/', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  // Validate that all fields are provided
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create a new contact
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    // Save the new contact to the database
    const savedContact = await newContact.save();

    // Return the new contact's id in the response
    res.status(201).json({ message: "Contact created successfully", id: savedContact._id });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "An error occurred while creating the contact." });
  }
});

//PUT
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Extract the contact ID from the URL path
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  // Validate that the required fields are provided
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ message: "All fields are required to update the contact." });
  }

  try {
    // Find the contact by its ID
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Update the contact's details
    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.email = email;
    contact.favoriteColor = favoriteColor;
    contact.birthday = birthday;

    // Save the updated contact
    const updatedContact = await contact.save();

    // Respond with a success message and status code
    res.status(200).json({ message: "Contact updated successfully", contact: updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "An error occurred while updating the contact." });
  }
});

//GET
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

//DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract the contact ID from the URL path

  try {
    // Find and delete the contact by its ID
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "An error occurred while deleting the contact." });
  }
});

module.exports = router;
