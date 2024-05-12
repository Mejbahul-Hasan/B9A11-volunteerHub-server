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
        const beVolunteerCollection = client.db("volunteerDB").collection("beVolunteer");

        // read all services data for homePage
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().sort({ Deadline: 1 }).toArray();
            res.send(result);
        })

        // Create/save data from the Add Volunteer Post pages
        app.post('/addPosts', async (req, res) => {
            const addVolunteer = req.body;
            // console.log(addVolunteer);
            const result = await addPostsCollection.insertOne(addVolunteer);
            res.send(result);
        })

        // Read all added post data for Need Volunteer Page
        app.get('/addPosts', async (req, res) => {
            const result = await addPostsCollection.find().sort({ Deadline: 1 }).toArray();
            res.send(result);
        })

        // Read a single data for volunteer details
        app.get('/addPosts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await addPostsCollection.findOne(query)
            res.send(result)
        })

        // Read all data posted by user using email
        app.get('/addPosts-email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { organizerEmail: email }
            const result = await addPostsCollection.find(query).toArray();
            res.send(result)
        })

        // update a data in db
        app.put('/addPosts/:id', async (req, res) => {
            const id = req.params.id
            const updatePost = req.body
            const query = { _id: new ObjectId(id) }
            const options = {upsert: true}
            const updateDoc = {
                $set: {
                    ...updatePost,
                },
            }
            const result = await addPostsCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // Delete a single data from my volunteer post
        app.delete('/addPosts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await addPostsCollection.deleteOne(query)
            res.send(result)
        })

        // Create/save data from the Be Volunteer Post pages
        app.post('/beVolunteer', async (req, res) => {
            const beVolunteer = req.body;
            // console.log(beVolunteer);
            const result = await beVolunteerCollection.insertOne(beVolunteer);
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
