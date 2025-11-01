const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/tedin-collection");

const cardSchema = new mongoose.Schema({
  name: String,
  owned: Boolean
});

const Card = mongoose.model("Card", cardSchema);

// Obtener todas las cartas
app.get("/cards", async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// Marcar carta como owned/no owned
app.post("/cards/:name", async (req, res) => {
  const { owned } = req.body;
  const card = await Card.findOneAndUpdate(
    { name: req.params.name },
    { owned },
    { upsert: true, new: true }
  );
  res.json(card);
});

app.listen(4000, () => console.log("Servidor escuchando en puerto 4000"));
