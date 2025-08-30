import FileModel from "../models/File.model.js";
import userModel from "../models/User.model.js";
import nodemailer from "nodemailer";
import { template } from "./share.template.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";




export const fileUpload =async(req,res)=>{
     
 try {

    const file = req.file
    const filepath = file.path;
    const exactpath = filepath.replace(/\\/g,"/");
    const userdata = await userModel.findById(req.user.id);
    const fileextension = file.mimetype;
    const filetype = fileextension.split("/")[0]

    const newFile = new FileModel({
     user : userdata._id ,
     filename: file.originalname,
     Size : file.size,
     type:filetype,
     filepath:exactpath

   })
  await newFile.save();

   res.status(200).json({
    Message : "Successfully Store Data",
   })

    
 } catch (error) {
    res.status(401).send("invalid User")
 }

    
}

export const fetchFiles = async(req,res)=>{
   
  try {
     const userid = req.user.id;
     const objectId = new mongoose.Types.ObjectId(userid);
      const files = await FileModel.aggregate([{
       $match:{
          user : objectId
       }

      }])
      res.status(200).json(files);

  } catch (error) {
    res.status(500).send("Invalid Token")
  }



}

export const deleteFile = async(req,res)=>{
try {
    const file = await FileModel.findByIdAndDelete(req.params.id);
    if(!file){
        res.status(404).json({
            message:"File already deleted or not found "
        })
    }
  res.status(200).json("successfully deleted");
    

} catch (error) {
    // res.status(500).send("failed to delete")
    res.json(error)
}
}

export const downloadFile = async(req,res)=>{
   try {
 const path = req.body.path;
   if(!path){
    res.status(404).send("Invalid path");
   }
  res.download(path);


   } catch (error) {
    res.status(500).send("bad request");
    console.log(error)
   }
}

export const publicdownoldfile = (req,res)=>{

  const {filepath} = req.fileinfo;
  res.download(filepath);

}


export const shareFile = async (req, res) => {
    const bodydata = req.body;
  try {
    const mailing = nodemailer.createTransport({
          service:'gmail',
         auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

     const payload = {
        filename : bodydata.filename,
        filepath : bodydata.filepath
     }
  
     const token = jwt.sign(payload,process.env.DLFILESECRET_KEY,{
      expiresIn:"1h"
     })

    const recipient =  bodydata.senderemail;

     await mailing.sendMail({
  from: process.env.EMAIL_USER,
  to: recipient,
  subject: '🔔 Notification: Message from Share-King',
  html : template(bodydata,token)
  
});

    res.status(200).send("File shared via email");

  } catch (error) {
    res.status(500).json({
      error ,
      message : "failed to send email"
    });
  }
};

