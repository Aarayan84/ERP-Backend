import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createAssetService,
  getAllAssetsService,
  getAssetByIdService,
  updateAssetService,
  deleteAssetService,
} from "../services/asset.service.js";

const createAsset = asyncHandler(async (req, res) => {
  const asset = await createAssetService(req.body);

  return res.status(201).json(
    new ApiResponse(201, "Asset created successfully", asset)
  );
});

const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await getAllAssetsService(req.query);

  return res.status(200).json(
    new ApiResponse(200, "Assets fetched successfully", assets)
  );
});

const getAssetById = asyncHandler(async (req, res) => {
  const asset = await getAssetByIdService(req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Asset fetched successfully", asset)
  );
});

const updateAsset = asyncHandler(async (req, res) => {
  const asset = await updateAssetService(req.params.id, req.body);

  return res.status(200).json(
    new ApiResponse(200, "Asset updated successfully", asset)
  );
});

const deleteAsset = asyncHandler(async (req, res) => {
  await deleteAssetService(req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Asset deleted successfully")
  );
});

export {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};