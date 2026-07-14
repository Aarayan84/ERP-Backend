import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import { getDashboardService , getEmployeeDashboardService } from "../services/dashboard.service.js";

const getDashboard = asyncHandler(async (req, res) => {

    const dashboard = await getDashboardService();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Dashboard fetched successfully",
            dashboard
        )
    );

});

const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getEmployeeDashboardService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Employee dashboard fetched successfully",
      dashboard
    )
  );
});
export { getDashboard ,getEmployeeDashboard};