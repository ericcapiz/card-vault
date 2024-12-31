const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchGroupId: {
    type: String,
    required: true,
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
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 18000, // 5 hours in seconds (5 * 60 * 60)
  },
});

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
