import { userModel } from "../../../DB/usermodel.js";
import bcrybt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../services/sendEmailService.js";
import cloudinary from "../../utils/cloudinaryconfig.js";
import path from 'path'
import { generateQrCode } from "../../utils/Qrcode.js";
import { generateToken, verifyToken } from "../../utils/tokensVeriftand generate.js";

//===========sign up==========
export const signUp=async(req,res,next)=>
{
    const {username , email, password, gender }= req.body
        const isUserExist =await userModel.findOne({email})
        if (isUserExist){
            return res.status(409).json({message:"user is already exist"})
        }
        const token=jwt.sign({email},'email');
        const confirmaEmail=`http://localhost:8080/user/cEmail/${token}`
        const message=`<a href=${confirmaEmail}> click to comfirm your email</a>`
 const sendemail=   await sendEmail({
            message,
            to :email,
            subject:'confirm email'
        })
        if (!sendemail){
            return  res.status(500).json({message:"try again later please"})
        }
            const hashedPassword=bcrybt.hashSync(password, +process.env.salt);
            const userins=new userModel({username , email, password:hashedPassword, gender} )
            await userins.save();
          return  res.status(201).json({message:"user added",userins})
      

}
//=================confirm email==============
export const confirm=async(req,res,next)=>{
    const {token}=req.params;
   // const decodedData = jwt.verify(token,'email');
   const decodedData=verifyToken(token,'email')
   if(!decodedData){
    return next(new Error('confirmed false',{cause:400}))
   }
    const isconfirmedCheck=await userModel.findOne({email:decodedData.email})
    if (isconfirmedCheck.is_confirmed){
        return res.status(400).json({message:"email is already confirmed"})
    }
    const data= await userModel.findOneAndUpdate(
        {email:decodedData.email},
        {is_confirmed:true},
        {new:true})

 return res.status(200).json({message:"confirmed done",data})
    }
//===============log in ===================
export const signIn=async(req,res,next)=>{
   // try{
    const {email, password }= req.body
        const isUserExist =await userModel.findOne({email})
        if (!isUserExist){
          return res.status(404).json({message:"wrong email"})
        }
        else {
     const userpass=bcrybt.compareSync(password ,isUserExist.password)
     if (!userpass){
       return res.status(400).json({message:"wrong password .. try again"})
     }  
     else {
      /*  const userToken=jwt.sign(
          {email,id:isUserExist._id}
          ,process.env.SIGN_IN_TOKEN_SECRET,
          {
            expiresIn:20,
          }
          )*/
          const userToken = generateToken({
            payload:{}
            ,sign:process.env.SIGN_IN_TOKEN_SECRET,
            
             expiresIn:20,
          
        })
        console.log(userToken)
        if(!userToken){
        return  next(new Error('invalid log in ',{cause:400}))
        }
          isUserExist.token=userToken;
          await isUserExist.save();


        res.status(200).json({message:"show user data",userToken})
     }
   
}
   //}
  //  catch(err){
//console.log(err)
   //    res.status(500).json({message:"fail",err})  
    //  }
}
//=====================update profile ======================
export const updateProfile=async(req,res,next)=>{
   const {id}=req.author
  const {_id}=req.query;
  const {username}=req.body;
    const userExist = await userModel.findById({_id})
    
    if (!userExist){
        return res.status(400).json({message:"invalid user id"})
    }
    if (userExist._id.toString()!==id){
        return res.status(401).json({message:"unauthari\ed"})
    }
    const user = await userModel.findByIdAndUpdate(
        { _id},
        { username },
        { new: true },
      )
   
        return res.status(200).json({message:"done",user})
    
    

}
//==================get data ========================
export const getData=async(req,res,next)=>{
    const {_id}=req.query;
    try {
        const userDate=await userModel.findOne({_id})
        if (userDate){
          const qr=await generateQrCode({data : userDate})
            return res.status(200).json({message:"user data ",user_data :userDate , qr})
        }
        else {
            return res.status(404).json({message:"user is undefined "})
        }

    }
    catch (error){
        return res.status(500).json({message:"fail ",error})
    }
}
//===============verify token========================
export const token=async(req,res,next)=>{
    const{authorization}=req.headers;
    const decodedData=jwt.verify(authorization.split(" ")[1],process.env.SIGN_IN_TOKEN_SECRET)
    res.status(200).json({message:"done", decodedData}) 
}
//==================profilepiccture==============
export const profilePicture=async(req,res,next)=>{
    const {id}=req.author
    if(!req.file){
      return  next(new Error ('please upload profile photo',{cause:400}))
    }
    const {public_id,secure_url} =await cloudinary.uploader.upload(req.file.path,
        {
            folder:`users/profile/${id}`,

        })
      const user=await userModel.findByIdAndUpdate(id,{
        profile_pic:{public_id,secure_url}
    },{
        new:true,
    })

    if(!user){
        await cloudinary.uploader.destroy(public_id)
    }

    res.json({message:"Done",user})
}
//===========cover pics===============
export const coverPictures = async (req, res, next) => {
    const { id } = req.author
    if (!req.files) {
      return next(new Error('please upload pictures', { cause: 400 }))
    }
  
    const coverImages = []
    for (const file in req.files) {
        const File= req.files[file]
      for (const key of File) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          key.path,
          {
            folder: `Users/Covers/${id}`,
            resource_type: 'image',
          },
        )
      
        coverImages.push({ secure_url, public_id })
        }
    }
    const user = await userModel.findById(id)
  
    user.coverPictures.length
      ? coverImages.push(...user.coverPictures)
      : coverImages
  
    const userNew = await userModel.findByIdAndUpdate(
      id,
      {
        cover_pic: coverImages,
      },
      {
        new: true,
      },
    )
    res.status(200).json({ message: 'Done', userNew })
  }