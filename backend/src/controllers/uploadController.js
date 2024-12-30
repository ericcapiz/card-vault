const { processImage } = require("../utils/ocrUtils");

const uploadImages = async (req, res) => {
  try {
    // User ID is available from auth middleware
    const userId = req.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files uploaded" });
    }

    const results = await Promise.all(req.files.map(processImage));

    // Extract just the name and type from verified cards
    const processedCards = results
      .filter((result) => result.success && result.verifiedCard)
      .map((result) => ({
        name: result.verifiedCard.name,
        type: result.verifiedCard.type,
      }));

    res.json({
      message: "Images processed successfully",
      processedCards,
      userId, // Include userId in response
    });
  } catch (error) {
    console.error("Error processing images:", error);
    res
      .status(500)
      .json({ message: "Error processing images", error: error.message });
  }
};

module.exports = {
  uploadImages,
};
