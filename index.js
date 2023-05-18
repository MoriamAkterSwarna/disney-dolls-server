const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7cqr184.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addedToyCollection = client.db('disneyMagicToys').collection('addToys')


    app.get('/addToy', async(req, res)=>{
      
      let query = {};

      if(req.query?.email){
          query= {email: req.query.email}
      }
      const result = await addedToyCollection.find(query).toArray()
      res.send(result)
  })
    app.post('/addToy', async(req,res) =>{
      const addToy = req.body;

      console.log(addToy)
      const result = await addedToyCollection.insertOne(addToy)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Disney Toy World is Running')
})

app.listen(port, () => {
  console.log(`Disney Toy World is running on port:  ${port}`)
})