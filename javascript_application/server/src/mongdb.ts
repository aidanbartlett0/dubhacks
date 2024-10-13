import { MongoClient} from 'mongodb';


// MongoDB connection URI
const uri = "mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/";

// Create a new MongoClient
const client = new MongoClient(uri, );

// Route to fetch data from MongoDB
export const getdb = (_req:any, res:any) => {
  // Connect to the MongoDB client
  client.connect()
    .then(() => {
      const db = client.db('dubhacks');
      const uwwebsites = db.collection('uwwebsites');

      // Fetch all documents from the collection
      return uwwebsites.find({}).toArray();
    })
    .then((websites:any) => {
      // Send the response with the retrieved data
      res.status(200).send({ data: websites });
    })
    .catch((error:any) => {
      // Handle any errors during the process
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).send('Internal Server Error');
    })
    .finally(() => {
      // Ensure the MongoDB client is closed properly
      client.close().catch((err: any) => console.error('Error closing the connection:', err));
    });
};


