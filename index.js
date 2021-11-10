const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swoyo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("wildWestCars");
    const carCollection = database.collection("cars");
    const cartCollection = database.collection("cart");

    //! GET ALL TOUR INFO

    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // app.get("/cart", async (req, res) => {
    //   const cursor = cartCollection.find({});
    //   const cars = await cursor.toArray();
    //   res.send(cars);
    // });

    //! GET SINGLE CAR INFO

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific tour", id);
      const query = { _id: ObjectId(id) };
      const car = await carCollection.findOne(query);
      res.json(car);
    });

    //! ADD DATA TO CART

    // app.post("/cart", async (req, res) => {
    //   const tour = req.body;
    //   const result = await cartCollection.insertOne(tour);
    //   res.json(result, 'hello cart');
    // });

    //! GET CART DATA

    // app.get("/cart/:uid", async (req, res) => {
    //   const uid = req.params.uid;
    //   const query = { uid: uid };
    //   const result = await cartCollection.find(query).toArray();
    //   res.json(result);
    // });

    //! DELETE DATA FROM CART

    // app.delete("/delete/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await cartCollection.deleteOne(query);
    //   res.json(result);
    // });
  }
  finally {
    // await client.close()
  }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is running!')
})

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})