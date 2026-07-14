import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  requestAssetService,
  getMyRequestsService,
  getAllRequestsService,
  getRequestByIdService,
  updateRequestStatusService,
} from "../services/assetRequest.service.js";

const requestAsset = asyncHandler(async (req, res) => {
  const request = await requestAssetService(req.user._id, req.body);

  return res.status(201).json(
    new ApiResponse(201, "Asset requested successfully", request)
  );
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await getMyRequestsService(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "Requests fetched successfully", requests)
  );
});

const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await getAllRequestsService(req.query);

  return res.status(200).json(
    new ApiResponse(200, "Requests fetched successfully", requests)
  );
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await getRequestByIdService(req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Request fetched successfully", request)
  );
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await updateRequestStatusService(
    req.params.id,
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(200, "Request updated successfully", request)
  );
});

export {
  requestAsset,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
};