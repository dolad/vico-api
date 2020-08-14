const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "services",
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

const Services = mongoose.model("services", servicesSchema);

module.exports = Services;
