const express = require("express");
const router = express.Router();
const Collection = require("../../models/collection/Collection");
const Batch = require("../../models/batch/Batch");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");

// Create initial collection
router.post("/", async (req, res) => {
  try {
    const { title, description, batchGroupId } = req.body;

    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Token invalid - continue with null userId
      }
    }

    // Get cards from batch
    const batch = await Batch.findOne({ batchGroupId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const collection = new Collection({
      title,
      description,
      cards: batch.cards,
      userId,
    });

    const savedCollection = await collection.save();

    // Delete the batch after successful collection creation
    await Batch.deleteOne({ batchGroupId });

    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all collections for logged-in user
router.get("/", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const collections = await Collection.find({ userId: decoded.userId });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update collection title/description
router.put("/:id", async (req, res) => {
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

// Delete collection
router.delete("/:id", async (req, res) => {
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

// Delete card from collection
router.delete("/:id/cards/:cardIndex", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.cards.splice(parseInt(req.params.cardIndex), 1);
    await collection.save();
    res.json(collection);
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
