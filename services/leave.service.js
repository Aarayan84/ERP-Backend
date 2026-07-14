import LeaveRequest from "../models/LeaveRequest.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Employee Apply Leave
 */
const applyLeaveService = async (employeeId, data) => {
  const {
    leaveType,
    fromDate,
    toDate,
    reason,
  } = data;

  // Validation
  if (!leaveType || !fromDate || !toDate || !reason) {
    throw new ApiError(400, "All fields are required");
  }

  if (reason.trim().length < 20) {
    throw new ApiError(
      400,
      "Leave reason must be at least 20 characters"
    );
  }

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  if (startDate > endDate) {
    throw new ApiError(
      400,
      "From Date cannot be greater than To Date"
    );
  }

  // Calculate total days
  const totalDays =
    Math.ceil(
      (endDate - startDate) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const leave = await LeaveRequest.create({
    employee: employeeId,
    leaveType,
    fromDate: startDate,
    toDate: endDate,
    totalDays,
    reason,
  });

  return await LeaveRequest.findById(leave._id)
    .populate(
      "employee",
      "employeeId name email department designation"
    );
};

/**
 * Employee Leave History
 */
const getMyLeavesService = async (employeeId) => {
  return await LeaveRequest.find({
    employee: employeeId,
  })
    .populate(
      "employee",
      "employeeId name email"
    )
    .sort({ createdAt: -1 });
};

/**
 * Admin - All Leave Requests
 */

const getAllLeavesService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    leaveType,
    department,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const pipeline = [];

  // Join User Collection
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "employee",
      foreignField: "_id",
      as: "employee",
    },
  });

  pipeline.push({
    $unwind: "$employee",
  });

  // Join Admin Collection
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "approvedBy",
      foreignField: "_id",
      as: "approvedBy",
    },
  });

  pipeline.push({
    $unwind: {
      path: "$approvedBy",
      preserveNullAndEmptyArrays: true,
    },
  });

  const match = {};

  if (status) {
    match.status = status;
  }

  if (leaveType) {
    match.leaveType = leaveType;
  }

  if (department) {
    match["employee.department"] = department;
  }

  if (search) {
    match.$or = [
      {
        "employee.name": {
          $regex: search,
          $options: "i",
        },
      },
      {
        "employee.employeeId": {
          $regex: search,
          $options: "i",
        },
      },
      {
        "employee.email": {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  pipeline.push({
    $match: match,
  });

  pipeline.push({
    $sort: {
      [sortBy]: order === "asc" ? 1 : -1,
    },
  });

  const totalResult = await LeaveRequest.aggregate([
    ...pipeline,
    {
      $count: "count",
    },
  ]);

  const totalLeaves =
    totalResult.length > 0 ? totalResult[0].count : 0;

  pipeline.push({
    $skip: (page - 1) * limit,
  });

  pipeline.push({
    $limit: Number(limit),
  });

  const leaves = await LeaveRequest.aggregate(pipeline);

  return {
    leaves,
    totalLeaves,
    currentPage: Number(page),
    totalPages: Math.ceil(totalLeaves / limit),
  };
};

/**
 * Admin - Get Single Leave
 */
const getLeaveByIdService = async (id) => {
  const leave = await LeaveRequest.findById(id)
    .populate(
      "employee",
      "employeeId name email department designation"
    )
    .populate(
      "approvedBy",
      "employeeId name"
    );

  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }

  return leave;
};

/**
 * Admin - Approve / Reject Leave
 */
const updateLeaveStatusService = async (
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

  const leave = await LeaveRequest.findById(id);

  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }

  if (leave.status !== "Pending") {
    throw new ApiError(
      400,
      "Leave request already processed"
    );
  }

  leave.status = status;
  leave.remarks = remarks || "";
  leave.approvedBy = adminId;

  await leave.save();

  return await LeaveRequest.findById(id)
    .populate(
      "employee",
      "employeeId name department"
    )
    .populate(
      "approvedBy",
      "employeeId name"
    );
};

export {
  applyLeaveService,
  getMyLeavesService,
  getAllLeavesService,
  getLeaveByIdService,
  updateLeaveStatusService,
};