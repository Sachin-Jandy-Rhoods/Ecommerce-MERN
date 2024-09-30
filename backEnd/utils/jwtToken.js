import jwt from "jsonwebtoken"

const generateToken=(res,userId)=>{
        const token=jwt.sign({userId},process.env.JWT_KEY,{expiresIn: "30d"});

        //Set JWT as an HTTP-Only cookie
        res.cookie('jwt',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV !== "developement",
            sameSite:"strict",
            maxAge:30*60*60*1000
        })

        return token
};

export default generateToken