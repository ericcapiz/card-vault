const express = require("express");
const router = express.Router();
const Collection = require("../../models/collection/Collection");
const Batch = require("../../models/batch/Batch");
const auth = require("../../middleware/auth");
const XLSX = require("xlsx");

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
    ws["!cols"] = [
      { wch: 30 }, // Card Name column
      { wch: 20 }, // Card Type column
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Cards");

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${collection.title}.xlsx"`
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
router.post("/:id/cards", auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Handle the new cards (this would depend on how you're sending the cards)
    const newCards = req.body.cards;
    collection.cards.push(...newCards);

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
