const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "chrome-extension://hochjoliclncpdbbabaebkkflhkpgcdj");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // pour gérer les preflight CORS
  }

  next();
});



// ✅ JSON avec gros fichiers (images)
app.use(express.json({ limit: "50mb" }));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schéma Mongoose avec content mixte + userId
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
