
import jwt from 'jsonwebtoken'
//==================generate tokens =====================
export const generateToken=({
    payload={},
    sign=process.env.default_Sig,
    expiresIn='1d'
}={})=>{
    if(!Object.keys(payload).length){
        return false 
    }
const token =jwt.sign(payload,sign,{expiresIn})

return token
}
//=====================verify=============================
export const verifyToken=({
   tokenVerify='',
    sign=process.env.default_Sig,
  
}={})=>{
    if(!tokenVerify){
        return false 
    }
const token =jwt.verify(tokenVerify,sign)

return token
}