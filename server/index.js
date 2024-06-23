const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 5000;
//Middileware
app.use(bodyParser.json());
app.use(cors());
//Connection with mongoDB
mongoose.connect("mongodb://localhost:27017/crud-mern-one", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Database is connected!");
});

//Define schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

//CRUD routes
//Create
app.post("/items/new", (req, res) => {
  const newItem = new Item(req.body);
  newItem
    .save()
    .then((item) => res.status(201).json(item))
    .catch((err) =>
      res.status(400).json(`Error happend in post request ${err}`)
    );
});

//Read
app.get("/items/:id", (req, res) => {
  Item.find()
    .then((item) => res.status(201).json(item))
    .catch((err) =>
      res.status(400).json(`Error is hapeend in read request ${err}`)
    );
});

//Update
app.put("/items/update/:id", (req, res) => {
  Item.findById(req.params.id)
    .then((item) => {
      item.name = req.body.name;
      item.description = req.body.description;

      item
        .save()
        .then(() => res.json("Items Updated"))
        .catch((err) => res.status(400).json(`Err in find${err}`));
    })

    .catch((err) => res.status(400).json(`Updated error ${err}`));
});

//Delete
app.delete("/items/deleted/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() => res.json("Item deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});
//Listen in the server
app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
