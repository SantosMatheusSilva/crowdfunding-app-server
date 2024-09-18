// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
//const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const mongoose = require("mongoose");


// connect to mongo db

const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(process.env.MONGODB_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Retrying in 5 seconds...', err);
    setTimeout(connectWithRetry, 5000);  // Retry after 5 seconds
  });
};

// Call the function to establish the connection
connectWithRetry();
































/* 
const MONGO_URI = process.env.MONGODB_URI;
 mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  console.log('mongoDb URI', process.env.MONGODB_URI);  */
  
  /* const client = new MongoClient(MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 30000,  // 30 seconds for connection timeout
    serverSelectionTimeoutMS: 50000 // 50 seconds for server selection timeout
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  } */
  //run().catch(console.dir);