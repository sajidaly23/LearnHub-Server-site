import multer from "multer";
import path from "path";
import fs from "fs";
// import { registerUser } from "../controllers/userController";

// creates afolder if it does not exist
const createUploadsFolder = (folderpath: string) => {   //(jo string hoti hai, jese uploads/salary ya public/images
    if(!fs.existsSync(folderpath)) {   //fs.existsSync() check karta hai ke kya ye folder ya path already exist karta hai?
        fs.mkdirSync(folderpath, {recursive: true});  //Agar folder exist nahi karta, to fs.mkdirSync() se folder bana diya jata hai.
    }
};

// configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadpath = path.join("uploads");
        createUploadsFolder(uploadpath)
        cb(null, uploadpath); //null means no err and uploded path is terget path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

// file filter to allow only images
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb("only images are allowed");
    }
}

export const uploads =  multer({ storage, fileFilter});