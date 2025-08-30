  import jwt from "jsonwebtoken"

const verifyToken = (req,res)=>{
        
    try {
        const token = req.body.token;   
        const auth_user = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(!auth_user){
            res.status(404).json({
                message:"Token not found"
            })
        }
        res.status(200).json(auth_user);
          

    } catch (error) {
        res.status(401).json({
            message: "Invalid Token"
        })
    }

    
}

export default verifyToken;