const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const password = "FTsJVYtryjhcpCQs";

const uri =
  "mongodb+srv://organicUser:FTsJVYtryjhcpCQs@cluster0.hia2w.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");

  app.get("/products", (req, res) => {
    productCollection
      .find({})
      .limit(4)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log(" data added successfully");
      res.redirect("/");
    });
  });

  app.patch("/update/:id", (req, res) => {
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((res) => {
        res.send(res.modifiedCount > 0);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((res) => {
        res.send(res.deletedCount > 0);
      });
  });
  // const product = { name: "modhu", price: 25, quantity: 5 };
  // collection.insertOne(product).then((result) => {
  //   console.log(" one product added");
  // });
  // console.log("database connected");
  // perform actions on the collection object
});

app.listen(4000, () => {
  console.log("server started");
});
