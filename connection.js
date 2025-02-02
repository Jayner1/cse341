const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://syale0312:1qA2Edbii9wNVpQE@freecluster.kqrpk.mongodb.net/contacts?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 30000
  });

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB");

    await listDatabases(client);
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

/**
 * Print the names of all available databases
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 */
async function listDatabases(client) {
  try {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  } catch (error) {
    console.error('Error listing databases:', error);
  }
}
