const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/contacts', require('./routes/contacts')); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
