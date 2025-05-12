const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ← Charge .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// 🔌 Connexion à MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 📦 Schéma d'une entrée
const entrySchema = new mongoose.Schema({
  id: String,
  type: String,
  content: String,
  name: String,
  mime: String,
  url: String,
  size: Number,
  date: String,
});

const Entry = mongoose.model("Entry", entrySchema);

// 🔄 Routes API
app.get("/entries", async (req, res) => {
  const entries = await Entry.find().sort({ date: 1 });
  res.json(entries);
});

app.post("/entries", async (req, res) => {
  const entry = new Entry(req.body);
  await entry.save();
  res.status(201).json({ success: true });
});

app.delete("/entries/:id", async (req, res) => {
  await Entry.deleteOne({ id: req.params.id });
  res.json({ success: true });
});

// ▶️ Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});


const entries = [];

// GET : retourne uniquement les entrées de l'utilisateur
app.get("/entries", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }

  const filtered = entries.filter(e => e.userId === userId);
  res.json(filtered);
});

// POST : ajoute une nouvelle entrée avec userId obligatoire
app.post("/entries", (req, res) => {
  const { userId, ...entry } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in body" });
  }

  const newEntry = { userId, ...entry };
  entries.push(newEntry);
  res.status(201).json({ success: true });
});

// DELETE (optionnel)
app.delete("/entries/:id", (req, res) => {
  const index = entries.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    entries.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Entry not found" });
  }
});
