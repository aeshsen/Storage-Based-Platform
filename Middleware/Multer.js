import multer from "multer";
import path from "path";
import uuidToNumber  from "../controller/uniqueId.js"

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      const fieldname = file.fieldname;
     if(fieldname === "uploadfile"){
        return cb(null,`Storage/Files`);
     }
      cb(null,`Storage/pictures`);

    },
    filename:(req,file,cb)=>{
        const file_extension = path.extname(file.originalname);
        const uniquename = uuidToNumber();
        cb(null,uniquename+file_extension)
    }
})

const upload = multer({
    storage
})
export default upload 