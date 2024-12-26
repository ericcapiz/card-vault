const express = require("express");
const multer = require("multer");
const { uploadImages } = require("../controllers/uploadController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // Maximum 10 files
  },
});

// Keep using "image" to match your existing setup
router.post("/image", upload.array("image", 10), uploadImages);

module.exports = router;
