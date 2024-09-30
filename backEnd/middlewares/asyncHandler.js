const asyncHandler=(func)=>(req,res,next)=>{
    Promise.resolve(func(req,res,next)).catch((error)=>{
        res.status(500).json({message:error.message});
    });
};

export default asyncHandler;