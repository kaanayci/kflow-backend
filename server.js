// ✅ server.js compatible extensions navigateur (Chrome, Edge, Firefox)
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware CORS dynamique 100% compatible extensions
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && (
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("moz-extension://") ||
    origin.startsWith("edge-extension://")
  )) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// ✅ JSON body parser après CORS
app.use(express.json({ limit: "50mb" }));

// ✅ Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schéma avec support fichiers (Mixed) et userId
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

// ✅ Routes
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

// ✅ Start
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});