import AssetRequest from "../models/AssetRequest.js";
import Asset from "../models/Asset.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * Employee Request Asset
 */
const requestAssetService = async (employeeId, data) => {
  const { asset, quantity, purpose } = data;

  if (!asset || !quantity || !purpose) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const existingAsset = await Asset.findById(asset);

  if (!existingAsset) {
    throw new ApiError(404, "Asset not found");
  }

  if (existingAsset.availableQuantity < quantity) {
    throw new ApiError(
      400,
      `Only ${existingAsset.availableQuantity} item(s) available`
    );
  }

  const request = await AssetRequest.create({
    employee: employeeId,
    asset,
    quantity,
    purpose,
  });

  return await AssetRequest.findById(request._id)
    .populate("employee", "employeeId name department")
    .populate("asset", "assetCode assetName brand");
};

/**
 * Employee Request History
 */
const getMyRequestsService = async (employeeId) => {
  return await AssetRequest.find({
    employee: employeeId,
  })
    .populate("asset", "assetCode assetName brand")
    .sort({ createdAt: -1 });
};

/**
 * Admin Get All Requests
 */
const getAllRequestsService = async (query) => {
  const features = new ApiFeatures(
    AssetRequest.find()
      .populate("employee", "employeeId name department")
      .populate("asset", "assetCode assetName")
      .populate("approvedBy", "employeeId name"),
    query
  )
    .filter()
    .sort()
    .paginate();

  const requests = await features.query;

  const totalRequests = await AssetRequest.countDocuments();

  return {
    requests,
    totalRequests,
  };
};

/**
 * Admin Get Request By Id
 */
const getRequestByIdService = async (id) => {
  const request = await AssetRequest.findById(id)
    .populate("employee", "employeeId name department")
    .populate("asset", "assetCode assetName")
    .populate("approvedBy", "employeeId name");

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  return request;
};

/**
 * Admin Approve / Reject Request
 */
const updateRequestStatusService = async (
  id,
  adminId,
  data
) => {
  const { status, remarks } = data;

  if (!["Approved", "Rejected"].includes(status)) {
    throw new ApiError(
      400,
      "Status must be Approved or Rejected"
    );
  }

  const request = await AssetRequest.findById(id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (request.status !== "Pending") {
    throw new ApiError(
      400,
      "Request already processed"
    );
  }

  if (status === "Approved") {
    const asset = await Asset.findById(request.asset);

    if (!asset) {
      throw new ApiError(404, "Asset not found");
    }

    if (asset.availableQuantity < request.quantity) {
      throw new ApiError(
        400,
        "Insufficient asset quantity"
      );
    }

    asset.availableQuantity -= request.quantity;

    asset.status =
      asset.availableQuantity > 0
        ? "Available"
        : "Out of Stock";

        await asset.save();
      }

  request.status = status;
  request.remarks = remarks || "";
  request.approvedBy = adminId;
  request.approvedAt = new Date();

  await request.save();

  return await AssetRequest.findById(id)
    .populate("employee", "employeeId name department")
    .populate("asset", "assetCode assetName")
    .populate("approvedBy", "employeeId name");
};

export {
  requestAssetService,
  getMyRequestsService,
  getAllRequestsService,
  getRequestByIdService,
  updateRequestStatusService,
};