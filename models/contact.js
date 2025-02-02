const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  favoriteColor: String,
  birthday: String,
});

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;
