const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "assets",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    compound: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
