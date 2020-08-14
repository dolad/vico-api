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

router.post("/assets", auth, createAsset);

// with filtering GET /task?completed=true

router.get("/assets", auth, getAssets);

// get by id

router.get("/assets/:id", auth, getAssetById);

// update assetby id

router.patch("/assets/:id", auth, updateAssets);

router.delete("/assets/:id", auth, deleteAssets);

module.exports = router;
