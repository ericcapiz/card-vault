const express = require("express");
const router = express.Router();
const Collection = require("../../models/collection/Collection");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");

// Create collection - no auth required, but uses userId if available
router.post("/", async (req, res) => {
  try {
    const { title, description, batchGroupId } = req.body;
    const token = req.header("Authorization")?.replace("Bearer ", "");

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Token invalid - that's fine, continue as anonymous
      }
    }

    const collection = new Collection({
      title,
      description,
      batchGroupId,
      userId: userId, // Will be null for anonymous users, set for logged-in users
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
