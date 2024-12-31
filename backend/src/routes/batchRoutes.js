const express = require("express");
const router = express.Router();
const Batch = require("../../models/batch/Batch");
const auth = require("../../middleware/auth");
const multer = require("multer");
const { processImage } = require("../utils/ocrUtils");
const upload = multer({ storage: multer.memoryStorage() });

// Create batch (process images and store)
router.post("/", auth, upload.array("images", 10), async (req, res) => {
  try {
    console.log("=== Batch Creation Started ===");
    console.log("Request body:", req.body);
    console.log("Files received:", req.files ? req.files.length : "no files");
    console.log("Auth user ID:", req.userId);

    const { batchGroupId } = req.body;
    const files = req.files;
    const userId = req.userId; // From auth middleware

    console.log("BatchGroupId from body:", batchGroupId);
    console.log("Number of files:", files?.length);
    console.log("User ID:", userId);

    if (!files || files.length === 0) {
      console.log("Error: No files provided");
      return res.status(400).json({ message: "No images provided" });
    }

    if (!batchGroupId) {
      console.log("Error: No batchGroupId provided");
      return res.status(400).json({ message: "No batch group ID provided" });
    }

    // Process all images in parallel using shared OCR utility
    console.log("Starting OCR processing...");
    const results = await Promise.all(files.map(processImage));
    console.log("OCR Results:", results);

    // Extract just the name and type from verified cards
    const newCards = results
      .filter((result) => result.success && result.verifiedCard)
      .map((result) => ({
        name: result.verifiedCard.name,
        type: result.verifiedCard.type,
      }));
    console.log("Processed cards:", newCards);

    // Find existing batch with this groupId
    const existingBatch = await Batch.findOne({ batchGroupId });
    console.log("Existing batch found:", existingBatch ? "yes" : "no");

    let savedBatch;
    if (existingBatch) {
      // Append new cards to existing batch
      existingBatch.cards = [...existingBatch.cards, ...newCards];
      savedBatch = await existingBatch.save();
      console.log("Updated existing batch:", savedBatch);
      res.status(200).json(savedBatch);
    } else {
      // Create new batch
      const batch = new Batch({
        batchGroupId,
        cards: newCards,
        userId,
      });
      savedBatch = await batch.save();
      console.log("Created new batch:", savedBatch);
      res.status(201).json(savedBatch);
    }
  } catch (error) {
    console.error("Batch creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all batches for a group
router.get("/group/:batchGroupId", auth, async (req, res) => {
  try {
    const batches = await Batch.find({
      batchGroupId: req.params.batchGroupId,
      userId: req.userId,
    }).sort({ createdAt: 1 });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all batches for a group
router.delete("/group/:batchGroupId", auth, async (req, res) => {
  try {
    await Batch.deleteMany({
      batchGroupId: req.params.batchGroupId,
      userId: req.userId,
    });
    res.json({ message: "All batches in group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete card from batch
router.delete("/:batchGroupId/cards/:cardIndex", auth, async (req, res) => {
  try {
    const { batchGroupId, cardIndex } = req.params;

    const batch = await Batch.findOne({
      batchGroupId,
      userId: req.userId,
    });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Remove card at specified index
    batch.cards.splice(parseInt(cardIndex), 1);
    await batch.save();

    res.json({ cards: batch.cards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
