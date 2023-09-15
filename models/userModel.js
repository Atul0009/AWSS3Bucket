import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    apiKey:{
        type:String
    }
},{timestamps:true});

const User = mongoose.model("users", userSchema)

export default User;