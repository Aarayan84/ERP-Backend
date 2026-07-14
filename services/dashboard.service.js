import User from "../models/User.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Asset from "../models/Asset.js";
import AssetRequest from "../models/AssetRequest.js";
import ApiError from "../utils/ApiError.js";


const getDashboardService = async () => {

    const [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,

        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,

        totalAssets,
        availableAssets,
        outOfStockAssets,

        totalAssetRequests,
        pendingAssetRequests,
        approvedAssetRequests,
        rejectedAssetRequests

    ] = await Promise.all([

        User.countDocuments(),

        User.countDocuments({
            status: "active"
        }),

        User.countDocuments({
            status: "inactive"
        }),

        LeaveRequest.countDocuments(),

        LeaveRequest.countDocuments({
            status: "Pending"
        }),

        LeaveRequest.countDocuments({
            status: "Approved"
        }),

        LeaveRequest.countDocuments({
            status: "Rejected"
        }),

        Asset.countDocuments(),

        Asset.countDocuments({
            status: "Available"
        }),

        Asset.countDocuments({
            status: "Out of Stock"
        }),

        AssetRequest.countDocuments(),

        AssetRequest.countDocuments({
            status: "Pending"
        }),

        AssetRequest.countDocuments({
            status: "Approved"
        }),

        AssetRequest.countDocuments({
            status: "Rejected"
        })

    ]);
    const recentLeaves = (await LeaveRequest.find()
        .populate("employee", "name employeeId")
        .sort({ createdAt: -1 })
        .limit(10))
        .filter((leave) => leave.employee);
    const recentAssetRequests = (await AssetRequest.find()
        .populate("employee", "name employeeId")
        .populate("asset", "assetName")
        .sort({ createdAt: -1 })
        .limit(5)).filter(
            (request) => request.employee && request.asset
            ).slice(0, 5);
    return {

        employees: {

            total: totalEmployees,

            active: activeEmployees,

            inactive: inactiveEmployees

        },

        leaves: {

            total: totalLeaves,

            pending: pendingLeaves,

            approved: approvedLeaves,

            rejected: rejectedLeaves

        },

        assets: {

            total: totalAssets,

            available: availableAssets,

            outOfStock: outOfStockAssets

        },

        assetRequests: {

            total: totalAssetRequests,

            pending: pendingAssetRequests,

            approved: approvedAssetRequests,

            rejected: rejectedAssetRequests

        },
        recentLeaves,
        recentAssetRequests

    };

};
const getEmployeeDashboardService = async (employeeId) => {
    const employee = await User.findById(employeeId).select(
        "name employeeId department designation role"
        );

        if (!employee) {
        throw new ApiError(404, "Employee not found");
        }
  const pendingLeaves = await LeaveRequest.countDocuments({
    employee: employeeId,
    status: "Pending",
  });

  const approvedLeaves = await LeaveRequest.countDocuments({
    employee: employeeId,
    status: "Approved",
  });

  const rejectedLeaves = await LeaveRequest.countDocuments({
    employee: employeeId,
    status: "Rejected",
  });

  const pendingAssetRequests =
    await AssetRequest.countDocuments({
      employee: employeeId,
      status: "Pending",
    });

  const approvedAssetRequests =
    await AssetRequest.countDocuments({
      employee: employeeId,
      status: "Approved",
    });

  const rejectedAssetRequests =
    await AssetRequest.countDocuments({
      employee: employeeId,
      status: "Rejected",
    });

  const recentLeaves = await LeaveRequest.find({
    employee: employeeId,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentAssetRequests =
    await AssetRequest.find({
      employee: employeeId,
    })
      .populate("asset", "assetName")
      .sort({ createdAt: -1 })
      .limit(5);


  return {
    employee,
    leaves: {
      pending: pendingLeaves,
      approved: approvedLeaves,
      rejected: rejectedLeaves,
    },

    assetRequests: {
      pending: pendingAssetRequests,
      approved: approvedAssetRequests,
      rejected: rejectedAssetRequests,
    },

    recentLeaves,

    recentAssetRequests,
  };
};
export {
    getDashboardService,
    getEmployeeDashboardService
};