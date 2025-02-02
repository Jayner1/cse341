const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let dbConnection;

const connectDb = (callback) => {
  const uri = "mongodb+srv://syale0312:1qA2Edbii9wNVpQE@freecluster.kqrpk.mongodb.net/contacts?retryWrites=true&w=majority";

  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      dbConnection = client.db();
      console.log("Connected to Database");
      callback();  // Call the callback once the connection is successful
    })
    .catch((err) => {
      callback(err);  // Call the callback with the error if connection fails
    });
};

const getDb = () => dbConnection;  // Function to get the database connection

module.exports = { connectDb, getDb };
