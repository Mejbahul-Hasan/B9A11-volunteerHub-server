const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
}
// middleware
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3ukwfo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const servicesCollection = client.db("volunteerDB").collection("services");
        const addPostsCollection = client.db("volunteerDB").collection("addPosts");

        // read all services data for homePage
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().sort({ Deadline: 1 }).toArray();
            res.send(result);
        })

        // Create/save data from the Add Volunteer Post pages
        app.post('/addPosts', async(req, res)=>{
            const addVolunteer = req.body;
            console.log(addVolunteer);
            const result = await addPostsCollection.insertOne(addVolunteer);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('VOLUNTEER SERVER IS RUNNING')
})
app.listen(port, () => {
    console.log(`Volunteer server is running on port: ${port}`)
})
