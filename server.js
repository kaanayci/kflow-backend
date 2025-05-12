// ✅ server.js pour Fly.io : 100% compatible extension, CORS, Docker et MongoDB
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware CORS universel compatible extensions
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ JSON body parser (supporte les fichiers encodés en tableau)
app.use(express.json({ limit: "50mb" }));

// ✅ Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Schéma d’entrée
const entrySchema = new mongoose.Schema({
  id: String,
  type: String,
  content: mongoose.Schema.Types.Mixed,
  name: String,
  mime: String,
  url: String,
  size: Number,
  date: String,
  userId: String
});
const Entry = mongoose.model("Entry", entrySchema);

// ✅ Routes API
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

const path = require("path");
app.use("/", express.static("/root/kflow-backend/public"));



// ✅ Start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fly.io API live on port ${PORT}`);
});


