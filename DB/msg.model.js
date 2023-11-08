import mongoose, { SchemaTypes } from "mongoose";
import { Schema } from "mongoose";
const msgSChema=new Schema({
    content :{
        type:String,
        required:true,
    },
    sendTo :{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{
timestamps:true,
})
export const msgModel=mongoose.model('message',msgSChema)