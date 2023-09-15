import mongoose from "mongoose";
import User from "./userModel.js";

const uploadSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    filename:{
        type:String
    },
    mimeType:{
        type:String
    },
    path:{
        type:String
    }
},{timestamps:true});

const Upload = mongoose.model("uploads", uploadSchema)

export default Upload;