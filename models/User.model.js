import mongoose, { Schema,model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    Username : {
        type:String,
        require:true,
        unique:true,
        trim:true,
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profile_picture:{
        type:String,
        default:"pictures/1084837575445321000.png"
    },
    FileStorage : {
        type:mongoose.Types.ObjectId,
        ref :"plan",
    },

},{timestamps:true});

userSchema.pre("save",async function(next){
   this.password = await bcrypt.hash(this.password,12);
   next();
})

const userModel = model("user",userSchema);

export default userModel