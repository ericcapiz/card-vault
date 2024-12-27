const vision = require("@google-cloud/vision");
const path = require("path");
const axios = require("axios");

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "../config/google-credentials.json"),
});

const cleanCardName = (cardName) => {
  if (!cardName) return "";

  return cardName
    .trim()
    .replace(/\s{2,}/g, " ") // Fix multiple spaces first
    .replace(/\s+(?<!A|RA|OR|FOR)(?:GE|CE)$/, "") // Remove standalone GE/CE
    .replace(/\s+[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]$/, ""); // Remove any Japanese/Chinese character at end
};

const verifyCardName = async (ocrResult) => {
  try {
    const baseUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    const searchTerm = ocrResult.split(" ")[0];
    const url = `${baseUrl}?fname=${encodeURIComponent(searchTerm)}`;

    const response = await axios.get(url);

    if (response.data && response.data.data && response.data.data.length > 0) {
      const results = response.data.data;
      const ocrWords = ocrResult.toLowerCase().split(" ");

      // Score each result
      const scoredResults = results.map((card) => {
        const cardName = card.name.toLowerCase();
        const cardWords = cardName.replace(/-/g, " ").split(" ");

        // Calculate basic word match score
        const matchingWords = ocrWords.filter((word) =>
          cardWords.includes(word)
        );
        let score = matchingWords.length;

        // Bonus points for exact matches
        if (cardName === ocrResult.toLowerCase()) score += 10;

        // Bonus points for matching word order
        const ocrPhrase = ocrWords.join(" ");
        if (cardName.includes(ocrPhrase)) score += 5;

        // Penalty for extra words
        const extraWords = cardWords.length - ocrWords.length;
        if (extraWords > 0) score -= extraWords * 0.5;

        return { card, score };
      });

      // Sort by score
      scoredResults.sort((a, b) => b.score - a.score);

      // Only use match if it has a good score
      if (scoredResults[0].score >= 2) {
        const bestMatch = scoredResults[0].card;
        return {
          name: bestMatch.name,
          id: bestMatch.id,
          type: bestMatch.type,
          desc: bestMatch.desc,
          race: bestMatch.race,
          archetype: bestMatch.archetype,
          card_images: bestMatch.card_images,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error verifying card:", error.message);
    return null;
  }
};

const processImage = async (file) => {
  try {
    const imageContext = {
      imageContext: {
        textDetectionParams: {
          enableTextDetectionConfidenceScore: true,
        },
        imageProperties: {
          contrastAdjustment: 1.2,
          brightnessAdjustment: -0.1,
        },
      },
    };

    const [result] = await client.textDetection({
      image: { content: file.buffer },
      imageContext: imageContext,
    });

    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return {
        filename: file.originalname,
        error: "No text detected",
        success: false,
      };
    }

    const lines = detections[0].description
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const cardName = findCardName(lines);
    const cleanedName = cleanCardName(cardName);

    // Verify with YGO API
    const verifiedCard = await verifyCardName(cleanedName);

    return {
      filename: file.originalname,
      ocrResult: cleanedName,
      verifiedCard: verifiedCard,
      success: verifiedCard !== null,
    };
  } catch (error) {
    return {
      filename: file.originalname,
      error: error.message,
      success: false,
    };
  }
};

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files uploaded" });
    }

    // Process all images in parallel
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
    });
  } catch (error) {
    console.error("Error processing images:", error);
    res
      .status(500)
      .json({ message: "Error processing images", error: error.message });
  }
};

const findCardName = (lines) => {
  for (const line of lines) {
    if (
      line.length <= 3 ||
      line.includes("[") ||
      line.includes("ATK/") ||
      line.includes("DEF/")
    ) {
      continue;
    }

    if (line === line.toUpperCase() && line.length > 3) {
      return line;
    }
  }
  return null;
};

module.exports = { uploadImages };
