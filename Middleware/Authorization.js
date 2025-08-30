import jwt from "jsonwebtoken"

const Authorization =async (req,res,next)=>{
     const auth = req.headers.authorization
    if(!auth){
        return res.status(400).send("bad request");
    }
    const [type,token] = auth.split(" ");

     if(type!=="Bearer"){
        return res.status(400).send("bad request");
     }
        
     try {
     const validUser = await jwt.verify(token,process.env.JWT_SECRET_KEY);

      if(!validUser){
        return res.status(400).send("bad request");
      }
      
      req.user = validUser;
         next();
     } catch (error) {
        res.status(400).send("bad request");
     }

     
}
export default Authorization