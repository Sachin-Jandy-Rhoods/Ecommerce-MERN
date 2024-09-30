import mongoose from "mongoose"

const connectDb=async()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log(`Succesfully connected`);
        
    } catch (error) {
        console.log(`ERROR ${error.message}`)
        process.exit(1)
    }
}

export default connectDb;