import express from "express";
import mainController from "../controllers/mainController.js";
import userAuth from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js"
const Router = express.Router();


Router.post("/register",mainController.register); // Register
Router.post("/createBucket",userAuth,mainController.createBucket); // Create bucket
Router.get("/getBuckets",userAuth,mainController.getAllBuckets); // List buckets
Router.post("/uploadFile",userAuth, upload().single('myFile'), mainController.uploadFile); // Upload files
Router.get("/getAllFiles",userAuth,mainController.getAllFiles); // Get files from specific bucket
Router.delete("/deleteFile",userAuth,mainController.deleteFileFromBucket); //Delete File
Router.get("/getAllLists",userAuth,mainController.getAllLists); // Get file Lists
Router.put("/updateFiles",userAuth,mainController.updateFile); // Update Files

export default Router;