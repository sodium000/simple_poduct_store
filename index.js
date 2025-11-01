const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is server run ");
});

// dataBase connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@chat-application.qhq6ecs.mongodb.net/?appName=chat-application`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run(){
    try {
        await client.connect();

        const dataBase = client.db("samrt-porduct")
        const productCollection = dataBase.collection("porducts");

        app.post("/porducts",async (req,res)=>{
            const newProduect = req.body;
            console.log(newProduect);
            const resuslt = await productCollection.insertOne(newProduect)
            res.send(resuslt);
        })


        app.delete('/porducts/:id', async (req,res) => {
            const ID = req.params.id
            const query = {
                "_id" : new ObjectId(ID)
            }
            const resuslt = await productCollection.deleteOne(query)
            res.send(resuslt);

        })

        app.patch('/porducts/:id', async(req,res)=>{
            const ID = req.params.id;
            const updateProduce = req.body;
            const query = {
                "_id": new ObjectId(ID)
            };
            const update = { $set :
                {"name": updateProduce.name,
                "Price": updateProduce.Price}
            };
            const option = {};
            const resuslt = await productCollection.updateOne(query,update,option)
            res.send(resuslt);
        })
        
        app.get('/porducts', async(req,res)=>{
            const resuslt = await (await productCollection.find().sort({price_min:1}).toArray())
            res.send(resuslt);
        })

        await client.db('admin').command({ping : 1});
        console.log("ping your deployment.you successfully connected to MongoDB")
        
    } finally {
        // client.close()
    }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
}); 
 