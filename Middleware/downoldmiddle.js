import jwt from "jsonwebtoken"
const downoldmiddleware = (req,res,next)=>{
  const {token} = req.query;
  if(!token){
    res.status(500).send("bad Request");
   }

  const verifyToken = jwt.verify(token,process.env.DLFILESECRET_KEY);

  if(!verifyToken){
    res.status(500).send("bad request");
  }

    req.fileinfo = verifyToken;

 next();

}
export default downoldmiddleware