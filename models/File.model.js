import mongoose, { Schema,model } from "mongoose";

const FileSchema = new Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref: "user",
        required :true,
       },
     filename:{
        type:String,
        require:true,
        trim : true

     } ,
     Size :{
        type:Number,
        require:true,
     },
     type:{
        type:String,
        require:true,
        trim : true
     },
     filepath:{
      type:String,
       equire:true,

     }


},{timestamps:true});

const FileModel = model("File",FileSchema);
export default FileModel