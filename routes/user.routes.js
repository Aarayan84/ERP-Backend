import express from "express";

import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/user.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Logged in user
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// Admin Routes
router.post("/", protect, authorize("admin"), createEmployee);

router.get("/", protect, authorize("admin"), getAllEmployees);

router.get("/:id", protect, authorize("admin"), getEmployeeById);

router.put("/:id", protect, authorize("admin"), updateEmployee);

router.delete("/:id", protect, authorize("admin"), deleteEmployee);

export default router;