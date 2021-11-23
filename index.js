const cors = require("cors");
const express = require("express");
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
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");

    // GET ALL CAR INFO

    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET SINGLE CAR INFO

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.json(result);
    });

    // ADD DATA TO CAR

    app.post("/cars", async (req, res) => {
      const car = req.body;
      const result = await carCollection.insertOne(car);
      res.json(result);
    });

    // DELETE DATA FROM CAR

    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.json(result);
    });

    // GET ALL CART INFO

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET USER'S CART DATA

    app.get("/cart/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await cartCollection.find(query).toArray();
      res.json(result);
    });

    // ADD DATA TO CART

    app.post("/cart", async (req, res) => {
      const car = req.body;
      const result = await cartCollection.insertOne(car);
      res.json(result);
    });

    // DELETE DATA FROM CART

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.json(result);
    });

    // GET ALL REVIEW INFO

    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // ADD DATA TO REVIEW

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // ADD USER
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // FIND UNIQUE EMAIL
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // MAKE ADMIN
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      // console.log('put',user);
          const filter = { email: user.email };
          const updateDoc = { $set: { role: "admin" } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
      });

      // GET USER BY EMAIL
      app.get("/users/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        // console.log(user);
        let isAdmin = false;
        if (user?.role === "admin") {
          isAdmin = true;
        }
        res.json({ admin: isAdmin });
      });
  }
  finally {
    // await client.close()
  }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Wild West Cars Server Is Running!')
})

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})