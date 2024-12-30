const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchGroupId: {
    type: String,
    required: true,
    index: true,
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

// Index for batchGroupId and createdAt
batchSchema.index({ batchGroupId: 1, createdAt: 1 });

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
