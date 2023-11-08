import { Router } from "express";
import * as uc from './user.controller.js'
import { asynchandler } from "../../utils/errorhandling.js";
import { isAuth } from "../../middlewares/auth.js";
import { validationCore } from "../../middlewares/validation.js";
import { SignUpSchema } from "./userValidationSchema.js";
import {  multerFunction } from "../../services/multerlocally.js";
import { allowedExtension } from "../../utils/allowedextensions.js";
import { multerCloudFunction } from "../../services/multercloud.js";
const router=Router();
router.post ('/si',asynchandler(uc.signUp))
router.get('/log',asynchandler( uc.signIn))
router.get('/cEmail/:token' , asynchandler(uc.confirm))
router.patch('/up',isAuth(),asynchandler(uc.updateProfile))
 router.get('/g',uc.getData)
router.get('/token',asynchandler(uc.token))
router.post('/profile',isAuth(),multerCloudFunction(allowedExtension.Image).single('profile'),
asynchandler(uc.profilePicture))
router.post(
    '/cover',
    isAuth(),
    multerCloudFunction(allowedExtension.Image, 'User/Covers').fields([
      { name: 'cover', maxCount: 5 },
      { name: 'image', maxCount: 2 },
    ]),
    asynchandler(uc.coverPictures),
  )
export default router;