const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const entries = [];

app.use(cors());
app.use(express.json());

app.get("/entries", (req, res) => {
  res.json(entries);
});

app.post("/entries", (req, res) => {
  const entry = req.body;
  if (!entry || !entry.id) {
    return res.status(400).json({ error: "Invalid entry" });
  }
  entries.push(entry);
  res.status(201).json({ success: true });
});

app.delete("/entries/:id", (req, res) => {
  const id = req.params.id;
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }
  entries.splice(index, 1);
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("✅ K-Flow API is running.");
});

app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
