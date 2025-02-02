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
      callback();  
    })
    .catch((err) => {
      callback(err);  
    });
};

const getDb = () => dbConnection;  

module.exports = { connectDb, getDb };
