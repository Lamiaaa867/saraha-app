import { msgModel } from "../../../DB/msg.model.js";
import { userModel } from "../../../DB/usermodel.js";

//=======================send messages==============================
export const sendMsg=async(req,res,next)=>{
   
    const{content ,sendTo}=req.body;
    const userExist=await userModel.findById(sendTo)
    if (!userExist){
        return res.status(400).json ({massage:"not found"})
    }
    const message=new msgModel({content ,sendTo})
    await message.save();
    return res.status(200).json ({massage:"Done",message})

}
//==============get messages======================
export const getMsg=async(req,res,next)=>{
    const{_id}=req.body;
    const messages= await msgModel.find({sendTo:_id})
    if (messages.length){
        return res.status(200).json ({massage:"Done",messages})
    }
    return res.status(200).json ({massage:"inbox in embyt"})
}
//================delete messages===================
export const delMsg=async(req,res,next)=>{
    const { msgId, loggedInUserId } = req.body;
  const message = await msgModel.findOneAndDelete({
    _id: msgId,
    sendTo: loggedInUserId,
  })
  if (message) {
    return res.status(200).json({ messsage: 'Done' })
  }
  res.status(401).json({ messsage: 'unAuthorized' })
}