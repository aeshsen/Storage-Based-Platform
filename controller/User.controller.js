import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import userModel from "../models/User.model.js";
import planModel from "../models/Plans.model.js";
import mongoose from "mongoose";
import FileModel from "../models/File.model.js";

export const signup = async (req, res) => {
    try {
        const filestorage = await planModel.findOne({planName:"Free"});
        req.body.FileStorage = filestorage._id;
         const data = req.body
        if (!data) {
            return res.status(404).json({
                message: "Something not found"
            })
        }
        const newUser = new userModel(data);
        await newUser.save();
        res.status(200).json({
            message: "successfully created data"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error in Sign-Route",
            error: error.message
        })
    }
}

export const Login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const verifyPassword = await bcrypt.compare(req.body.password, user.password);

        if (!verifyPassword) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
            picture : user.profile_picture,
            Storage : user.FileStorage,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "365d",
        });

        return res.status(200).json({
            message: "Login success",
            token,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};


export const profilePicUpload = async (req, res) => {
    try {
        const userdata = req.user;
        const file = req.file;
        const storage = file.path.replace(/\\/g, "/");
        const parts = storage.split("/");
        const actual_path = parts[1] + "/" + parts[2];

        const validUser = await userModel.findById(userdata.id);

        if (!validUser) {
            res.status(404).send("user not found");
        }
        await userModel.findOneAndUpdate({ _id: userdata.id }, { profile_picture: actual_path }, { new: true })



        const payload = {
            Username: validUser.Username,
            id: validUser._id,
            email: validUser.email,
            picture: actual_path
        }
        const token = await jwt.sign(payload,process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.status(200).json({
            message: "profile updated",
            token

        })


    } catch (error) {
        res.status(404).json({
            message: "failed to store image"
        })
    }
}

export const fetchingStorage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId,{FileStorage:1,_id:0}).populate("FileStorage","-_id Storage")
    const fileupload = await FileModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId), 
        },
      },{
        $group : {
            _id : "$user",
            UsedStorage : {$sum:"$Size"}
        }
      },{
        $project:{
            _id:0,
            UsedStorage:1
        }
      }
    
    ]);

  const ConsumeStorage = fileupload.length ? fileupload[0].UsedStorage : 0;
  const OutOFStorage = user.FileStorage.Storage

   res.status(200).json({ConsumeStorage,OutOFStorage}); 

  } catch (error) {
    res.status(500).json({ error: error });
    
  }
};


