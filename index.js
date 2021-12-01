const express = require('express');
const app = express();
const { MongoClient} = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// Hello are your ready. Hello 

// middleware

app.use(cors());
app.use(express.json());



// Connecting Mongo Db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwvoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




// Function to get Data From the database

async  function run(){
    try{
        await client.connect();
        const database = client.db("theTravel");
        const offeringCollection = database.collection("offering");
        const orderCollection = database.collection("manageAllOrder");

        // Get All Data from the server
        app.get('/offering', async(req, res)=>{
            const cursor = offeringCollection.find({});
            const offering = await cursor.toArray();
            res.send(offering);
        })
        // Get All Data from the Manage All Orders
        app.get('/manageAllOrder', async(req, res)=>{
            const cursor = orderCollection.find({});
            const mangeAllOrder = await cursor.toArray();
            res.send(mangeAllOrder);
        })
        
        // GET Single Service
        app.get('/offering/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query ={_id: ObjectId(id)};
            const offer = await offeringCollection.findOne(query);
            res.json(offer)
        })

        // Post Api to create Offering in the database
        app.post('/offering', async (req, res)=>{ 
            const offering = req.body;
            const result = await offeringCollection.insertOne(offering);
            res.json(result)

        })
        // Post Api to create Offering in the database to manage All order
        app.post('/manageAllOrder', async (req, res)=>{ 
            const manageOrder = req.body;
            const resultManageOrder = await orderCollection.insertOne(manageOrder);
            res.json(resultManageOrder)

        })

        // Delete APi . It will delete Api
        app.delete('/manageAllOrder/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/hello', (req, res)=>{
    res.send("hello update here")
})

app.get('/', (req, res)=>{
    res.send('Hello World. Are you ready to go. Ready?')
});

app.listen(port, ()=>{
    console.log("BackEnd Server is Running. The port is: ", port);
})