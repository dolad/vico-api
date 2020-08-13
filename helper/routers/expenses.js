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

router.post("/api/expenses", auth, createExpenses);

// with filtering GET /task?completed=true

router.get("/api/expenses", auth, getAllExpenses);

router.get("/api/expenses/:id", auth, getExpensesById);

router.patch("/api/expenses/:id", auth, updateExpenses);

router.delete("/api/expenses/:id", auth, deleteExpenses);

module.exports = router;
