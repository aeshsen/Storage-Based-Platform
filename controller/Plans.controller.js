import planModel from "../models/Plans.model.js" 
export const Createplans =async (req,res)=>{
try {
    //  const storage = (req.body.Storage)*1000000;
     req.body.Storage *= 1000000 ;
    
    const newplan = new planModel(req.body);
    await newplan.save();
  
    res.status(200).json({
        message:"created plan successfully"
    })


} catch (error) {
    res.status(500).send("Failed to create")
}
}
export const Fetchplans = async(req,res)=>{
    try {
        const plans = await planModel.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(404).json({
            message:"Plans are not found"
        })
    }
}