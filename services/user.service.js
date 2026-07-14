import User from "../models/User.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

const createEmployeeService = async (data) => {
  const {
    employeeId,
    name,
    email,
    password,
    department,
    designation,
    salary,
    role,
  } = data;

  if (
    !employeeId ||
    !name ||
    !email ||
    !password ||
    !department ||
    !designation ||
    !salary
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new ApiError(409, "Email already exists");
  }

  const employeeExists = await User.findOne({ employeeId });

  if (employeeExists) {
    throw new ApiError(409, "Employee ID already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await User.create({
    employeeId,
    name,
    email,
    password: hashedPassword,
    department,
    designation,
    salary,
    role: role || "employee",
  });

  return await User.findById(employee._id).select("-password");
};

const getAllEmployeesService = async (query) => {
  const features = new ApiFeatures(
    User.find({
      status:"active",
    }),
    query
  )
    .search(["name", "email", "employeeId"])
    .filter()
    .sort()
    .paginate();

  const employees = await features.query.select("-password");

  const totalEmployees = await User.countDocuments({
    status:"active",
  });

  return {
    employees,
    totalEmployees,
  };
};

const getEmployeeByIdService = async (id) => {
  const employee = await User.findById(id).select("-password");

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;
};


const updateEmployeeService = async (id, data) => {
  const {
    employeeId,
    name,
    email,
    password,
    department,
    designation,
    salary,
    role,
  } = data;

  // Validate required fields (password is optional)
  if (
    !employeeId ||
    !name ||
    !email ||
    !department ||
    !designation ||
    !salary
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Find employee
  const employee = await User.findById(id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  // Check duplicate email (excluding current employee)
  const emailExists = await User.findOne({
    email,
    _id: { $ne: id },
  });

  if (emailExists) {
    throw new ApiError(409, "Email already exists");
  }

  // Check duplicate employee ID (excluding current employee)
  const employeeIdExists = await User.findOne({
    employeeId,
    _id: { $ne: id },
  });

  if (employeeIdExists) {
    throw new ApiError(409, "Employee ID already exists");
  }

  // Update fields
  employee.employeeId = employeeId;
  employee.name = name;
  employee.email = email;
  employee.department = department;
  employee.designation = designation;
  employee.salary = salary;
  employee.role = role;

  // Hash password only if a new one is provided
  if (password && password.trim() !== "") {
    employee.password = await bcrypt.hash(password, 10);
  }

  await employee.save();

  return await User.findById(employee._id).select("-password");
};

const deleteEmployeeService = async (id) => {
  const employee = await User.findById(id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  employee.status = "inactive";

  await employee.save();

  return await User.findById(employee._id).select("-password");
};



const updateProfileService = async (
  userId,
  data
) => {

  const {
    name,
    email,
    department,
    designation,
  } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (
    email &&
    email !== user.email
  ) {

    const emailExists =
      await User.findOne({ email });

    if (emailExists) {
      throw new ApiError(
        409,
        "Email already exists"
      );
    }

    user.email = email;
  }

  user.name = name || user.name;
  user.department =
    department || user.department;

  user.designation =
    designation || user.designation;

  await user.save();

  return await User.findById(userId)
    .select("-password");
};

const changePasswordService = async (
  userId,
  data
) => {

  const {
    oldPassword,
    newPassword,
  } = data;

  if (
    !oldPassword ||
    !newPassword
  ) {
    throw new ApiError(
      400,
      "Both passwords are required"
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  const isMatch =
    await bcrypt.compare(
      oldPassword,
      user.password
    );

  if (!isMatch) {
    throw new ApiError(
      400,
      "Old password is incorrect"
    );
  }

  user.password =
    await bcrypt.hash(newPassword, 10);

  await user.save();
};

export {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
  updateProfileService,
  changePasswordService,
};