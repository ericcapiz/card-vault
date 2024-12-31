const express = require("express");
const router = express.Router();
const Collection = require("../../models/collection/Collection");
const Batch = require("../../models/batch/Batch");
const auth = require("../../middleware/auth");
const XLSX = require("xlsx");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { processImage } = require("../utils/ocrUtils");

// Create collection - auth required
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, batchGroupId } = req.body;
    const userId = req.userId;

    // Get the cards from the batch if batchGroupId is provided
    let cards = [];
    if (batchGroupId) {
      const batch = await Batch.findOne({ batchGroupId, userId });
      if (batch) {
        cards = batch.cards;
      }
    }

    const collection = new Collection({
      title,
      description,
      cards,
      userId,
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

// Download collection - auth required
router.get("/:id/download", auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Format the data for Excel
    const formattedCards = collection.cards.map((card) => ({
      "Card Name": card.name,
      "Card Type": card.type,
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedCards, {
      header: ["Card Name", "Card Type"],
      skipHeader: false,
    });

    // Set column widths
    ws["!cols"] = [{ wch: 30 }, { wch: 20 }];

    // Use collection title as sheet name (sanitize it for Excel)
    const sheetName = collection.title
      .replace(/[\\*?:/[\]]/g, "")
      .substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Sanitize filename for download
    const safeFilename = collection.title.replace(/[^a-zA-Z0-9-_]/g, "_");

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the file
    res.send(buf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update collection - auth required
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

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
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.json({ message: "Collection deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete card from collection - auth required
router.delete("/:id/cards/:cardIndex", auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const cardIndex = parseInt(req.params.cardIndex);
    if (
      isNaN(cardIndex) ||
      cardIndex < 0 ||
      cardIndex >= collection.cards.length
    ) {
      return res.status(400).json({ message: "Invalid card index" });
    }

    collection.cards.splice(cardIndex, 1);
    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add cards to collection - auth required
router.post("/:id/cards", auth, upload.array("images"), async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Process all images in parallel using the same OCR utility
    const results = await Promise.all(req.files.map(processImage));

    // Extract just the name and type from verified cards
    const processedCards = results
      .filter((result) => result.success && result.verifiedCard)
      .map((result) => ({
        name: result.verifiedCard.name,
        type: result.verifiedCard.type,
      }));

    // Add the processed cards to the collection
    collection.cards.push(...processedCards);
    const updatedCollection = await collection.save();

    res.json(updatedCollection);
  } catch (error) {
    console.error("Error adding cards:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
