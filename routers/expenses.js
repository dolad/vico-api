const express = require("express");
const Expenses = require("../models/expenses");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const {
  createExpenses,
  getAllExpenses,
  getExpensesById,
  updateExpenses,
  deleteExpenses,
} = require("../controllers/expenses");

router.post("/expenses", auth, createExpenses);

// with filtering GET /task?completed=true

router.get("/expenses", auth, getAllExpenses);

router.get("/expenses/:id", auth, getExpensesById);

router.patch("/expenses/:id", auth, updateExpenses);

router.delete("/expenses/:id", auth, deleteExpenses);

module.exports = router;
