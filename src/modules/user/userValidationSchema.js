import joi from 'joi'
export const SignUpSchema= {
    body:joi.object({
        username:joi.string().min(3).max(10).required(),
        email:joi.string().email({tlds:{allow:['com','net','org']}}).required(),
        password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
        gender:joi.string().optional().required(),
    })
}