const express = require("express");
const router = express.Router();
const Batch = require("../../models/batch/Batch");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { processImage } = require("../utils/ocrUtils");
const upload = multer({ storage: multer.memoryStorage() });

// Create batch (process images and store)
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { batchGroupId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    if (!batchGroupId) {
      return res.status(400).json({ message: "No batch group ID provided" });
    }

    // Get userId if token exists
    let userId = null;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Continue with null userId if token is invalid
      }
    }

    // Process all images in parallel using shared OCR utility
    const results = await Promise.all(files.map(processImage));

    // Extract just the name and type from verified cards
    const newCards = results
      .filter((result) => result.success && result.verifiedCard)
      .map((result) => ({
        name: result.verifiedCard.name,
        type: result.verifiedCard.type,
      }));

    // Find existing batch with this groupId
    const existingBatch = await Batch.findOne({ batchGroupId });

    if (existingBatch) {
      // Append new cards to existing batch
      existingBatch.cards = [...existingBatch.cards, ...newCards];
      const savedBatch = await existingBatch.save();
      res.status(200).json(savedBatch);
    } else {
      // Create new batch
      const batch = new Batch({
        batchGroupId,
        cards: newCards,
        userId,
      });
      const savedBatch = await batch.save();
      res.status(201).json(savedBatch);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all batches for a group
router.get("/group/:batchGroupId", async (req, res) => {
  try {
    const batches = await Batch.find({
      batchGroupId: req.params.batchGroupId,
    }).sort({ createdAt: 1 });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all batches for a group
router.delete("/group/:batchGroupId", async (req, res) => {
  try {
    await Batch.deleteMany({ batchGroupId: req.params.batchGroupId });
    res.json({ message: "All batches in group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
