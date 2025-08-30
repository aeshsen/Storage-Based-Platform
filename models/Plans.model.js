import {model,Schema} from "mongoose";

const PlanSchema = new Schema({
    planName : {
        type:String,
        required: true,
        trim:true,
    },
    planPrice : {
        type : Number,
        required: true,
    },
    Storage:{
        type:Number,
        require : true
    }
},{ timestamps:true});

const planModel = model("plan",PlanSchema);

export default planModel; 