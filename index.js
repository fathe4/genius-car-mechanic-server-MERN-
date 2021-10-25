const express = require('express')
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9c9p0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()

        const database = client.db('geniusMechanic')
        const servicesCollection = database.collection('services')

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        // DISPLAY SINGLE DATA
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await servicesCollection.findOne(query)
            res.json(result)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log(service);
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)
        })

        // DELETE DATA
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            console.log('hitting delete', id);
            const query = { _id: objectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })

    } finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Calling from node server')
})


app.listen(port, () => {
    console.log('Running server port: ', port);
})