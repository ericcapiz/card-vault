const express = require("express");
const router = express.Router();
const Collection = require("../models/collection/Collection");
const auth = require("../middleware/auth");

// Public Routes (No auth needed)
// Create initial collection
router.post("/", async (req, res) => {
  try {
    const { title, description, processedCards } = req.body;

    const collection = new Collection({
      title,
      description,
      cards: processedCards,
      userId: null, // No user associated yet
    });

    const savedCollection = await collection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Protected Routes (Auth needed)
// Save collection to user profile
router.post("/:id/save", auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.userId = req.userId;
    await collection.save();

    res.json({ message: "Collection saved to profile", collection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's collections
router.get("/my-collections", auth, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.userId });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete collection (only if owned)
router.delete("/:id", auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Collection not found or not authorized" });
    }

    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a card from collection (Protected)
router.patch("/:collectionId/remove-card/:cardId", auth, async (req, res) => {
  try {
    const { collectionId, cardId } = req.params;

    const collection = await Collection.findOne({
      _id: collectionId,
      userId: req.userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Collection not found or not authorized" });
    }

    // Remove the specific card by ID
    collection.cards = collection.cards.filter(
      (card) => card._id.toString() !== cardId
    );

    await collection.save();

    res.json({
      message: "Card removed successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
