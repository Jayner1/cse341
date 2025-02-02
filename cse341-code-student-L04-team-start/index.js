require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // Import the generated Swagger JSON file
const app = express();

// Serve the Swagger UI at the /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes')); // Your routes

const db = require('./models');
db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });


  app.use((req, res, next) => {
    const apiKey = req.headers['apikey']; // or 'apiKey' depending on how you send it in the request
    const validApiKey = 'rvmyfjbw'; // Your valid API key
  
    // Check if the provided API key matches the valid key
    if (apiKey !== validApiKey) {
      return res.status(401).send('Invalid apiKey, please read the documentation.');
    }
  
    next(); // If the API key is valid, proceed to the next middleware/route
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
