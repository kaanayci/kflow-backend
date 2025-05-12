const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json({ limit: "50mb" }));



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

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
