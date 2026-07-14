import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import leaveRoutes from "./routes/leave.routers.js";
import assetRoutes from "./routes/asset.routes.js";
import assetRequestRoutes from "./routes/assetRequest.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cookieParser());



app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/assets", assetRoutes);
app.use(
  "/api/v1/asset-requests",
  assetRequestRoutes
);
app.use("/api/v1/dashboard", dashboardRoutes);



app.get("/",(req,res)=>{
    res.json({
        success:true,
        message : "ERP API Running Successfully"
    });
});

app.use(errorHandler);

export default app;
