import Asset from "../models/Asset.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

const createAssetService = async (data) => {
  const {
    assetCode,
    assetName,
    category,
    brand,
    totalQuantity,
    availableQuantity,
    description,
  } = data;

  if (
    !assetCode ||
    !assetName ||
    !category ||
    !brand ||
    totalQuantity === undefined
  ) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  if (Number(totalQuantity) <= 0) {
    throw new ApiError(
      400,
      "Total Quantity must be greater than 0"
    );
  }

  const finalAvailableQuantity =
    availableQuantity ?? totalQuantity;

  if (Number(finalAvailableQuantity) < 0) {
    throw new ApiError(
      400,
      "Available Quantity cannot be negative"
    );
  }

  if (
    Number(finalAvailableQuantity) >
    Number(totalQuantity)
  ) {
    throw new ApiError(
      400,
      "Available Quantity cannot be greater than Total Quantity"
    );
  }

  const assetExists = await Asset.findOne({
    assetCode,
  });

  if (assetExists) {
    throw new ApiError(
      409,
      "Asset Code already exists"
    );
  }

  const status =
    Number(finalAvailableQuantity) > 0
      ? "Available"
      : "Out of Stock";

  const asset = await Asset.create({
    assetCode,
    assetName,
    category,
    brand,
    totalQuantity,
    availableQuantity: finalAvailableQuantity,
    status,
    description,
  });

  return asset;
};

const getAllAssetsService = async (query) => {
  const features = new ApiFeatures(
    Asset.find(),
    query
  )
    .search(["assetName", "assetCode", "brand"])
    .filter()
    .sort()
    .paginate();

  const assets = await features.query;

  const totalAssets =
    await Asset.countDocuments();

  return {
    assets,
    totalAssets,
  };
};

const getAssetByIdService = async (id) => {
  const asset = await Asset.findById(id);

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  return asset;
};

const updateAssetService = async (id, data) => {
  const {
    totalQuantity,
    availableQuantity,
  } = data;

  if (
    totalQuantity !== undefined &&
    Number(totalQuantity) <= 0
  ) {
    throw new ApiError(
      400,
      "Total Quantity must be greater than 0"
    );
  }

  if (
    availableQuantity !== undefined &&
    Number(availableQuantity) < 0
  ) {
    throw new ApiError(
      400,
      "Available Quantity cannot be negative"
    );
  }

  if (
    totalQuantity !== undefined &&
    availableQuantity !== undefined &&
    Number(availableQuantity) >
      Number(totalQuantity)
  ) {
    throw new ApiError(
      400,
      "Available Quantity cannot be greater than Total Quantity"
    );
  }

  if (availableQuantity !== undefined) {
    data.status =
      Number(availableQuantity) > 0
        ? "Available"
        : "Out of Stock";
  }

  const asset =
    await Asset.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  return asset;
};

const deleteAssetService = async (id) => {
  const requestExists = await AssetRequest.exists({
  asset: id,
});

if (requestExists) {
  throw new ApiError(
    400,
    "Cannot delete asset because it has request history."
  );
}
  const asset =
    await Asset.findByIdAndDelete(id);

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  return;
};

export {
  createAssetService,
  getAllAssetsService,
  getAssetByIdService,
  updateAssetService,
  deleteAssetService,
};