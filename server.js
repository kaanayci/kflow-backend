const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ← Charge .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // autorise toutes les origines dynamiquement
  },
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


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
  userId: String // ← ajoute cette ligne !
});


const Entry = mongoose.model("Entry", entrySchema);

// 🔄 Routes API
app.get("/entries", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const entries = await Entry.find({ userId }).sort({ date: 1 });
  res.json(entries);
});


app.post("/entries", async (req, res) => {
  if (!req.body.userId) return res.status(400).json({ error: "Missing userId" });

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