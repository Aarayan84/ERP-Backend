import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
} from "../controllers/leave.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Employee
router.post("/", protect, authorize("employee"), applyLeave);

router.get("/my-leaves", protect, authorize("employee"), getMyLeaves);

// Admin
router.get("/", protect, authorize("admin"), getAllLeaves);

router.get("/:id", protect, authorize("admin"), getLeaveById);

router.patch("/:id", protect, authorize("admin"), updateLeaveStatus);

export default router;