
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USERDB}:${process.env.USERPASS}@cluster0.tkyyb.mongodb.net/?appName=Cluster0`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // all colection
        const userCollection = client.db('TaskManagementProject').collection('user')
        const taskCollection = client.db('TaskManagementProject').collection('task')

        // create api for user data-==================================
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        
        app.get('/user', async (req, res) => {
            const participet = req.body;
            const result = await userCollection.find(participet).toArray();
            res.send(result);
        })

         // create api for Added Task data======================================
         app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })
        
        app.get('/task', async (req, res) => {
            const participet = req.body;
            const result = await taskCollection.find(participet).toArray();
            res.send(result);
        })

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.get('/task/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const task = await taskCollection.find(query).toArray();
            res.send(task)
          })
        
          app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedTask = {
              $set: {
                status: task.status
              }
            }
            const result = await taskCollection.updateOne(filter, updatedTask, options)
            res.send(result)
          })

           
    app.delete('/task/:Id', async (req, res) => {
        const Id = req.params.Id
        const result = await taskCollection.deleteOne({ _id: new ObjectId(Id) })
        res.send(result)
      })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Task manegement server is running.......')
});
app.listen(port, () => {
    console.log(`Task manegement server is running on port:${port}`)
});