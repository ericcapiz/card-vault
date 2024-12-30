const express = require("express");
const router = express.Router();
const Collection = require("../../models/collection/Collection");
const auth = require("../../middleware/auth");

// Create collection - auth required
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, batchGroupId } = req.body;

    const collection = new Collection({
      title,
      description,
      batchGroupId,
      userId: req.userId, // Must have userId since auth is required
    });

    const savedCollection = await collection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all collections - auth required
router.get("/", auth, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.userId });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download collection - no auth required
router.get("/:id/download", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    // ... rest of download logic ...
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update collection - auth required
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.title = title || collection.title;
    collection.description = description || collection.description;

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete collection - auth required
router.delete("/:id", auth, async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.json({ message: "Collection deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
