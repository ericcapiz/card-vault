const express = require("express");
const router = express.Router();
const Collection = require("../../models/collection/Collection");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");

// Public Routes (No auth needed)
// Create initial collection
router.post("/", async (req, res) => {
  try {
    const { title, description, processedCards } = req.body;

    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // If there's a valid token, get the userId
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Token invalid - continue with null userId
      }
    }

    const collection = new Collection({
      title,
      description,
      cards: processedCards,
      userId: userId, // Will be null for non-authenticated users
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

// Add a card to collection (Protected)
router.patch("/:collectionId/add-card", auth, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { card } = req.body; // Expects { name: "Card Name", type: "Card Type" }

    const collection = await Collection.findOne({
      _id: collectionId,
      userId: req.userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Collection not found or not authorized" });
    }

    // Add the new card
    collection.cards.push(card);

    await collection.save();

    res.json({
      message: "Card added successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download collection as Excel spreadsheet
router.get("/:id/download", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Create safe filename
    const safeFileName = collection.title.replace(/[^a-z0-9]/gi, "_");
    const fileName = encodeURIComponent(`${safeFileName}.xlsx`);

    // Prepare data
    const worksheetData = collection.cards.map((card, index) => ({
      "No.": index + 1,
      "Card Name": card.name,
      "Card Type": card.type,
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: ["No.", "Card Name", "Card Type"],
    });

    // Set column widths
    const colWidths = [
      { wch: 5 }, // No. column
      { wch: 30 }, // Card Name column
      { wch: 15 }, // Card Type column
    ];
    worksheet["!cols"] = colWidths;

    // Add header style
    worksheet["!rows"] = [{ hpt: 25 }]; // Height of first row

    // Add borders and styling to all cells
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!worksheet[cell_ref]) continue;

        worksheet[cell_ref].s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
          alignment: {
            vertical: "center",
            horizontal: "left",
          },
        };

        // Header row styling
        if (R === 0) {
          worksheet[cell_ref].s.fill = {
            fgColor: { rgb: "CCCCCC" },
            patternType: "solid",
          };
          worksheet[cell_ref].s.font = {
            bold: true,
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Cards");

    // Write to buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      bookSST: false,
    });

    // Set headers
    res.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${fileName}`,
      "Content-Length": buffer.length,
    });

    // Send file
    res.end(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
