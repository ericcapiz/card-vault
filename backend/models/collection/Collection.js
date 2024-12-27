const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  cards: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add TTL index for anonymous collections
collectionSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 24 * 60 * 60, // 24 hours
    partialFilterExpression: { userId: null }, // Only for collections with no user
  }
);

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
