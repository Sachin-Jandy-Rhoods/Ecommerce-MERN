import User from "../models/userModel.js"
import asyncHandler from "./asyncHandler.js"
import jwt from "jsonwebtoken"

const authenticate=asyncHandler(async(req,res,next)=>{
    let token;
    //Read JWT token form "jwt" cookie
    token=req.cookies.jwt
    if(token){
        try {
            const decode= jwt.verify(token,process.env.JWT_KEY);
            req.user= await User.findById(decode.userId).select("-password");
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not authourized, token failed")
        }
    }
    else{
        res.status(401)
        throw new Error("Not authourized, no token")
    }
})

const authorizeAdmin=asyncHandler(async(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }
    else{
        res.status(401).send("Not authorized as an admin")
    }
})

export{authorizeAdmin,authenticate}