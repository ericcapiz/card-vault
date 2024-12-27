const express = require("express");
const router = express.Router();
const Collection = require("../models/collection/Collection");

// Create a new collection
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    const collection = new Collection({
      title,
      description,
      cards: [], // Start with empty cards array
    });

    const savedCollection = await collection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add cards to a collection
router.post("/:id/cards", async (req, res) => {
  try {
    const { cards } = req.body; // Array of verified cards
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.cards.push(...cards);
    const updatedCollection = await collection.save();

    res.json(updatedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
