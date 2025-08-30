import dotenv from "dotenv"
dotenv.config();


import mongoose from "mongoose";
mongoose.connect(process.env.DB_URL)

import express from "express"
import cors from "cors"
import { Login, profilePicUpload, signup,fetchingStorage } from "./controller/User.controller.js";
import bodyParser from "body-parser";
import verifyToken from "./controller/Verifytoken.js";
import upload from "./Middleware/Multer.js";
import downoldmiddleware from "./Middleware/downoldmiddle.js";
import Authorization from "./Middleware/Authorization.js";
import { deleteFile, downloadFile, fetchFiles, fileUpload,publicdownoldfile,shareFile } from "./controller/Files.controller.js";
import Dashboard from "./controller/DashBoard.js";
import { Createplans, Fetchplans } from "./controller/Plans.controller.js";


const app = express();
const Port = 7000;
app.listen(Port,()=> console.log(`Server is running on Port : ${Port}`))

app.use(express.static("view"));
app.use(express.static("Storage"));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json());

app.post("/api/signup",signup);
app.post("/api/login",Login);
app.post("/api/verify-token",verifyToken)
app.post("/api/upload-profile-pic", Authorization,upload.single("profilePic"),profilePicUpload)
app.post("/api/upload-File",Authorization,upload.single("uploadfile"),fileUpload);
app.get("/api/fetchFile",Authorization,fetchFiles)
app.delete("/api/deleteFile/:id",Authorization,deleteFile)
app.post("/api/downold",Authorization,downloadFile);
app.get("/api/downold",downoldmiddleware,publicdownoldfile);
app.post("/api/share",Authorization,shareFile);
app.get("/api/dashBoard",Authorization,Dashboard);


app.get("/api/fetchingstorage",Authorization,fetchingStorage);
app.post("/api/createplan",Authorization,Createplans);
app.get("/api/fetchplan",Authorization,Fetchplans);




