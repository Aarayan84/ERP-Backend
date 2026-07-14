import express from "express";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import {
  requestAsset,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
} from "../controllers/assetRequest.controller.js";

const router = express.Router();

// Employee
router.post(
  "/",
  protect,
  authorize("employee"),
  requestAsset
);

router.get(
  "/my-requests",
  protect,
  authorize("employee"),
  getMyRequests
);

// Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllRequests
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getRequestById
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateRequestStatus
);

export default router;