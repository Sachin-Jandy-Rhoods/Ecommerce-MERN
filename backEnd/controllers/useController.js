import User from "../models/userModel.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/jwtToken.js"

const createUser= asyncHandler(async(req,res)=>{
    const{username,password,email}=req.body
    if(!username || !password || !email)
    {
        throw new Error("Please enter all the mandatory fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const salt= await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password,salt);

    const newuser= new User({username,email,password:hashPassword})
    try {
        await newuser.save();
        generateToken(res,newuser._id)
        res.status(201).json({id:newuser._id, username: newuser.username, password: newuser.password, email: newuser.email, isAdmin: newuser.isAdmin})
    } catch (error) {
        res.status(400)
        throw new Error("Invalid user data")
    }
    
})

const login=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;

    const existEmail=await User.findOne({email});
    if(!existEmail)
    {
       return res.status(400).json({
        message:"No such Email exists"
       })
    }

    if(existEmail){
        const isValidPassword= await bcrypt.compare(password,existEmail.password)
        console.log("is?",isValidPassword);

        if(!isValidPassword){
            res.status(401).json({message:"Invalid credentials"})
            return
        }
        
        if(isValidPassword){
            generateToken(res,existEmail._id)

            res.status(201).json({
                _id: existEmail._id,
                username: existEmail.username,
                email: existEmail.email,
                isAdmin: existEmail.isAdmin
            })
            return;
        }
    }
})


const logout=asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        expires:new Date(0),
    })
    res.status(200).json({
        message:"Logged OUt Succesfully"
    })
})

const getAllUser=asyncHandler(async(req,res)=>{
    const users=await User.find({});
    res.json(users);
})

const getCurrentUserProfile=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id)
    if(!user){
       res.status(404)
       throw new Error("User not found")
    }
    
    res.status(201).json({
        _id:user._id,
        username:user.username,
        email:user.email
}) 
})

const updateCurrentProfile=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id);
    if(user){
        user.username=req.body.username||user.username
        user.email=req.body.email|| user.email

        if(req.body.password){
            const salt= await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(req.body.password,salt);
            user.password=hashPassword
        }

        const updatedUser= await  user.save();
        console.log(updatedUser);
        

        res.json({
            id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })
    }
    else{
        res.status(404)
        throw new Error("User not found")
    }

})

const deleteUserById=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id);
    console.log(user);
    
    
    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error("Cannot delete admin user")
        }
        await user.deleteOne({ _id: user._id });
        res.status(200).json({message:"User removed"});
    }
    else{
            res.status(404);
            throw new Error("User not found");
    }
})

const getUserById=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id);
    if(!user){
        res.status(401);
        throw new Error("User not found")
    }
    res.status(200).json({ user })
})

const updateUserById=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(user){
        user.username=req.body.username||user.username;
        user.email=req.body.email|| user.email;
        user.isAdmin=Boolean(req.body.isAdmin);

        const updatedUser= await user.save();

        res.status(200).json(
            {
                id:updatedUser._id,
                username:updatedUser.username,
                email:updatedUser.email,
                isAdmin:updatedUser.isAdmin
            }
        )

    }else{
        res.status(404)
        throw new Error("User not found")
    }


})

export {createUser,login,logout,getAllUser,getCurrentUserProfile,updateCurrentProfile,deleteUserById,getUserById,updateUserById}