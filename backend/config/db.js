
import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const dataConnect = await mongoose.connect(process.env.MONGO_URI)
         console.log(`data is succssfull connect`)
    } catch (error) {
        console.log("error")
        process.exit(1);
        
    }
}


export default connectDB