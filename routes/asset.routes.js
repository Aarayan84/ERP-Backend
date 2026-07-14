import express from "express";

import {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from "../controllers/asset.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Admin Routes
router.post("/", protect, authorize("admin"), createAsset);

router.put("/:id", protect, authorize("admin"), updateAsset);

router.delete("/:id", protect, authorize("admin"), deleteAsset);

// Common Routes
router.get("/", protect, getAllAssets);

router.get("/:id", protect, getAssetById);

export default router;