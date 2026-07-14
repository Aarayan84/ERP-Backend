import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  applyLeaveService,
  getMyLeavesService,
  getAllLeavesService,
  getLeaveByIdService,
  updateLeaveStatusService,
} from "../services/leave.service.js";

const applyLeave = asyncHandler(async (req, res) => {
  const leave = await applyLeaveService(req.user._id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Leave applied successfully", leave));
});

const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await getMyLeavesService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Leave history fetched", leaves));
});

const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await getAllLeavesService(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, "All leave requests fetched", leaves));
});

const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await getLeaveByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Leave fetched successfully", leave));
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
  const leave = await updateLeaveStatusService(
    req.params.id,
    req.user._id,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Leave status updated", leave));
});

export {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
};