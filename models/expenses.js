const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "expenses",
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

const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
