const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://syale0312:1qA2Edbii9wNVpQE@freecluster.kqrpk.mongodb.net/contacts?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri);

  try {
    await client.connect();
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
  const databasesList = await client.db('contacts').admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
