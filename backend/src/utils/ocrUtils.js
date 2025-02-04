const vision = require("@google-cloud/vision");
const sharp = require("sharp");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

// Creates a client using environment variables
const client = new vision.ImageAnnotatorClient({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
});

const cleanCardName = (cardName) => {
  if (!cardName) return "";
  return cardName
    .trim()
    .replace(/\s{2,}/g, " ")
    .replace(/\s+(?<!A|RA|OR|FOR)(?:GE|CE)$/, "")
    .replace(/\s+[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]$/, "");
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

      const scoredResults = results.map((card) => {
        const cardName = card.name.toLowerCase();
        const cardWords = cardName.replace(/-/g, " ").split(" ");

        let score = ocrWords.filter((word) => cardWords.includes(word)).length;
        if (cardName === ocrResult.toLowerCase()) score += 10;
        if (cardName.includes(ocrWords.join(" "))) score += 5;
        const extraWords = cardWords.length - ocrWords.length;
        if (extraWords > 0) score -= extraWords * 0.5;

        return { card, score };
      });

      scoredResults.sort((a, b) => b.score - a.score);

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

const processImage = async (file) => {
  try {
    // Optimize image before OCR
    const optimizedBuffer = await sharp(file.buffer)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .grayscale()
      .sharpen()
      .toBuffer();

    const imageContext = {
      imageContext: {
        textDetectionParams: {
          enableTextDetectionConfidenceScore: true,
        },
      },
    };
    const [result] = await client.textDetection({
      image: { content: optimizedBuffer },
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
    const verifiedCard = await verifyCardName(cleanedName);

    return {
      filename: file.originalname,
      ocrResult: cleanedName,
      verifiedCard: verifiedCard,
      success: verifiedCard !== null,
    };
  } catch (error) {
    console.error("Error in processImage:", error);
    console.error("Error details:", error.message);
    return {
      filename: file?.originalname || "unknown",
      error: error.message,
      success: false,
    };
  }
};

module.exports = {
  processImage,
  cleanCardName,
  verifyCardName,
  findCardName,
};
