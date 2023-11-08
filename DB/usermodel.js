import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema = new Schema({
    username:{
        type:String,
        required :true,
        lowercase:true,
    },
    email:{
        type: String,
        unique:true,
    },
is_confirmed:{
    type:Boolean,
    default:false
}
,
    password:{
        type:String,
        required :true,
    },
    profile_pic:{
        secure_url:String ,
        public_id:String ,
    },
    cover_pic:[
        {
            secure_url:String ,
            public_id:String ,
        }
    ],

    gender:{
     type:String,
    enum: ['male','female','not specified'],
  
    },
    token:{
        type:String
    }
},{
    timestamps:true,
})
export const userModel =mongoose.model('user',userSchema)
