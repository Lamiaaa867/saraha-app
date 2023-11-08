import express from 'express'
import { config } from 'dotenv';
config()
import * as allRouters from './src/modules/routes.js'
import { connectDB } from './DB/connection.js';
const port =process.env.port;

const app =express();
app.use (express.json());
connectDB()
app.use('/uploads',(express.static('./uploads')))
app.use ('/msg',allRouters.msgRouter)
app.use('/user',allRouters.userRouter)
app.use('*',(req,res,next)=>
 res.status(404).json({message:"URL NOT FOUND"})

)
app.use((err,req,res,next)=>{
    if(err){
        return res.status(err['cause']||500).json({message:err.message})
    }
})
app.listen(port,()=>{
    console.log("server is runinng")
})
