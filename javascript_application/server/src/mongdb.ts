const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); // Import CORS

const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Proxy route to the external API
app.post('/api/mgdb', async (req:any, res:any) => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body), // Forward the request body
  }});
// MongoDB connection URI
const uri = "mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/";

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Route to fetch data from MongoDB
app.get('/api/mgdb', async (_req:any, res:any) => {
  try {
    await client.connect();
    const db = client.db('dubhacks');
    const uwwebsites = db.collection('uwwebsites');

    // Fetch all documents from the collection
    const websites = await uwwebsites.find({}).toArray();
    res.json(websites);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close(); // Close the client connection
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

