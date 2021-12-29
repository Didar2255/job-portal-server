const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express()
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const port = process.env.PORT || 5000

// Middle ware

app.use(express.json())
app.use(cors())

// Connection with MongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzbym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database Collections

async function run() {
    try {
        await client.connect();
        const database = client.db('Tech-Foring')
        const jobCollection = database.collection('jobs')
        const userCollection = database.collection('users')

        // create job post api
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job)
            console.log(result);
            res.send(result)
        });
        // get all jobs api
        app.get('/allJobs', async (req, res) => {
            const jobs = jobCollection.find({})
            const result = await jobs.toArray()
            res.json(result)
        })
        // get jobs by Id
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const result = await jobCollection.findOne({ _id: ObjectId(id) });
            res.send(result)
        });
        // delete job by id
        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const result = await jobCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('WelCome  to tech foring Server')
})

app.listen(port, () => {
    console.log('Identify port:', port);
})