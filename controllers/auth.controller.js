import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generatedToken.js";
import ApiResponse from "../utils/ApiResponse.js";

const register= async (req,res)=>{
    try{
        const{
            employeeId,
            name,
            email,
            password,
            department,
            designation,
            salary,
            role,
        }=req.body;
        if (
            !employeeId ||
            !name ||
            !email ||
            !password ||
            !department ||
            !designation ||
            !salary
        ) {
            return res
            .status(400)
            .json(new ApiResponse(400, "All fields are required"));
        }
        const emailExists= await User.findOne({email});
        if(emailExists){
            return res.status(409).json(new ApiResponse(409,"Email already exists"));
        }

        const employeeExists= await User.findOne({employeeId});
        if(employeeExists){
            return res.status(409).json(new ApiResponse(409,"Employee ID already exists"));
        }
        const hashedPassword= await bcrypt.hash(password,10);

        const user = await User.create({
            employeeId,
            name,
            email,
            password: hashedPassword,
            department,
            designation,
            salary,
            role
        });
        const createdUser = await User.findById(user._id).select("-password");
        const token = generateToken(createdUser.id,createdUser.role);

        return res.status(201).json(
            new ApiResponse(201,"User Registered Successfully",{
                token,
                createdUser
            })
        )
    }
    catch(error){
        return res
        .status(500)
        .json(new ApiResponse(500,error.message));
    }
};

const login = async (req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(400)
            .json(new ApiResponse(400,"Email and Password are required"));
        }

        const user= await User.findOne({email});
        if(!user){
            return res
            .status(404)
            .json(new ApiResponse(404,"User not found"));
        }
         // Prevent inactive employees from logging in
        if (user.status === "inactive") {
            return res
                .status(403)
                .json(
                    new ApiResponse(
                        403,
                        "Your account has been deactivated. Please contact the administrator."
                    )
                );
        }

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401)
            .json(new ApiResponse(401,"Invalid Credentials"));
        }

        const loggedInUser = await User.findById(user._id).select("-password");

        const token = generateToken(loggedInUser._id,loggedInUser.role);

        return res.status(200).json(
            new ApiResponse(200,"Login Successful",{
                token,
                user: loggedInUser,
            })
        );
    }
    catch(error){
        return res.
        status(500)
        .json(new ApiResponse(500,error.message));
    }
};

const logout = async (req,res)=>{
    res.send("Logout Api");
};

export {register,login,logout};