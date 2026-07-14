import express from "express";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import { getDashboard,getEmployeeDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
    "/",
    protect,
    authorize("admin"),
    getDashboard
);
router.get(
  "/employee",
  protect,
  authorize("employee"),
  getEmployeeDashboard
);
export default router;