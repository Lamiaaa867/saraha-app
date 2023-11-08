import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { allowedExtension } from '../utils/allowedextensions.js';
import { nanoid } from 'nanoid';
export const multerCloudFunction=(customvalidation)=>{
const storage=multer.diskStorage({ })
const fileFilter=function(req,file,cb){
    if(customvalidation.includes(file.mimetype)){
        return cb(null,true)
    }
    cb(new Error('invalid extension'),false)
}
    const fileupload=multer({ fileFilter,storage})
    return fileupload

}