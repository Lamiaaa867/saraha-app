import { Schema } from "mongoose"

const reqMethod=['body','query','params','file','headers','files']
export const validationCore=(schema)=>{
    return (req,res,next)=>{
        const validateError=[]
for (const key of reqMethod){
    if(schema[key]){
        const validateResult=schema[key].validate(req[key],{
            abortEarly:false
        })
        console.log(validateResult.error.details);
       if(validateResult.error){
        validateError.push(validateResult.error.details)
       }
    }
}
next()
console.log(validateResult.error.details)
return res.status(400).json({Error:validateResult.error.details})
  
    }
}
