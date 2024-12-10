const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_GYMUSER}:${process.env.DB_GYMPASS}@cluster0.phy8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("gymDB");
        const gymCollection = database.collection("gymData");
        const gymUsers = database.collection("gymusers");

        app.get("/schedule", async (req, res) => {
            const cursor = gymCollection.find();
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get("/schedule/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await gymCollection.findOne(query);
            res.send(result)
        })



        app.post("/schedule", async (req, res) => {
            const postBody = req.body
            const result = await gymCollection.insertOne(postBody);
            res.send(result)
        })

        app.put("/schedule/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const upBody = req.body
            const updateDoc = {
                $set: {
                    title: upBody.title,
                    selecteddate: upBody.selecteddate,
                    selectedday: upBody.selectedday,
                    selectedtime: upBody.selectedtime,
                }
            }

            const result = await gymCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        app.put("/status/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    isComplete : true
                }
            }

            const result = await gymCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        app.delete("/schedule/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await gymCollection.deleteOne(query);
            res.send(result)

        })


        //  firebase account Setup//mjf

        app.get('/users', async (req, res) => {
            const cursor = gymUsers.find();
            const result = await cursor.toArray()
            res.send(result)
        })


        app.post("/users", async (req, res) => {
            const postBody = req.body
            const result = await gymUsers.insertOne(postBody);
            res.send(result)
        })



        app.patch("/users/:email", async (req, res) => {
            const email = req.params.email
            const filter = {email};
            const options = { upsert: true };
            const upLoginBody = req.body
            const updateDoc = {
                $set: {
                    loginObj : upLoginBody.loginObj

                }
            }

            const result = await gymUsers.updateOne(filter, updateDoc, options);
            res.send(result)
        })








        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







// mongodb setup//

app.get("/", (req, res) => {
    res.send("I'm Rj Azmir")
})

app.listen(port, () => {

    console.log(`server coltace ${port}`);
})