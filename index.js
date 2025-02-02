const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();

// Enable CORS for all routes
app.use(cors());

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    // You can set specific headers here if you want more control
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));

mongodb.connectDb((err) => {  // Changed this line to use connectDb
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
