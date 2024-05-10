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


app.get('/', (req, res) => {
    res.send('VOLUNTEER SERVER IS RUNNING')
  })
  app.listen(port, () => {
    console.log(`Volunteer server is running on port: ${port}`)
  })
