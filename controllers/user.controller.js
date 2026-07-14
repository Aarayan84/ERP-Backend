import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
  updateProfileService,
  changePasswordService,
} from "../services/user.service.js";

const createEmployee = asyncHandler(async (req, res) => {
  const employee = await createEmployeeService(req.body);

  return res.status(201).json(
    new ApiResponse(201, "Employee created successfully", employee)
  );
});

const getAllEmployees = asyncHandler(async (req, res) => {
    const data = await getAllEmployeesService(req.query);

    return res.status(200).json(
    new ApiResponse(200, "Employees fetched successfully", data)
    );
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await getEmployeeByIdService(req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Employee fetched successfully", employee)
  );
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await updateEmployeeService(req.params.id, req.body);

  return res.status(200).json(
    new ApiResponse(200, "Employee updated successfully", employee)
  );
});

const deleteEmployee = asyncHandler(async (req, res) => {
  await deleteEmployeeService(req.params.id);

  return res.status(200).json(
    new ApiResponse(200, "Employee deleted successfully")
  );
});

const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", req.user)
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateProfileService(
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile updated successfully",
      user
    )
  );
});

const changePassword = asyncHandler(async (req, res) => {
  await changePasswordService(
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password changed successfully"
    )
  );
});

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getProfile,
  updateProfile,
  changePassword
};