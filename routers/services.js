const express = require("express");
const Services = require("../models/services");
const { auth } = require("../middlewares/auth");
const router = express.Router();

const {
  createServices,
  getAllServices,
  getServicesById,
  updateServices,
  deleteServices,
} = require("../controllers/services");

router.post("/services", auth, createServices);

// with filtering GET /task?completed=true

router.get("/services", auth, getAllServices);

router.get("/services/:id", auth, getServicesById);

router.patch("/services/:id", auth, updateServices);

router.delete("/services/:id", auth, deleteServices);

module.exports = router;
