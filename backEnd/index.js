//packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//Utiles
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRouters.js"

dotenv.config()
const port=process.env.PORT||8000

connectDb();

const app=express()

app.use(express.json())
//have to learn
app.use(express.urlencoded({extended: true}));
//for store jwt in cookie =>utils->jwtToken
app.use(cookieParser());

app.use("/api/users",userRoutes);

app.listen(port,()=>{
    console.log(`Server is running succesfully on ${port}`); 
})