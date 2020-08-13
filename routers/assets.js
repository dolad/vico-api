const express = require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();

const {
  createAsset,
  getAssets,
  getAssetById,
  updateAssets,
  deleteAssets,
} = require("../controllers/assets");

router.post("/api/assets", auth, createAsset);

// with filtering GET /task?completed=true

router.get("/api/assets", auth, getAssets);

// get by id

router.get("/api/assets/:id", auth, getAssetById);

// update assetby id

router.patch("/api/assets/:id", auth, updateAssets);

router.delete("/api/assets/:id", auth, deleteAssets);

module.exports = router;
