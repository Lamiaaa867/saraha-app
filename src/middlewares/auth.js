import jwt from 'jsonwebtoken'
import { userModel } from '../../DB/usermodel.js'
export const isAuth=()=>{
    return async(req,res,next) => {
        try{
  // const {authorization}=req.header
   const { authorization } = req.headers
  // console.log(authorization)
   if (!authorization){
   return res.status(400).json({message:"log in first"})
   }
if (!authorization.startsWith('saraha')){
    return res.status(400).json({message:"invalid prefix token"})
}

    const splitToken=authorization.split(' ')[1];
    try{
    const decodedData=jwt.verify(splitToken,process.env.SIGN_IN_TOKEN_SECRET)
if (!decodedData||!decodedData.id){
    return res.status(400).json({message:"invalid token"})
}
const findUser=await userModel.findById(decodedData.id)
if(!findUser){
    return res.status(400).json({message:"sign up first"})
}
req.author=findUser;
next();
    }
    catch(error){
        if(error=='TokenExpiredError: jwt expired'){
            const user = await userModel.findOne({token:splitToken})
            if(!user){
                return res.status(400).json({message:" wroong token"})  
            }
            const userToken =jwt.sign({email:user.email, id:user._id},process.env.SIGN_IN_TOKEN_SECRET,
                {expiresIn:20})
                user.token=userToken;
                await user.save();
                return res.status(200).json({message:"refreshed token ", userToken})   
        }
        console.log(error)
        return res.status(500).json({message:"invalid token"})
    }
    }
catch(error){
    return res.status(500).json({message:"error in auth"})
}
}
}