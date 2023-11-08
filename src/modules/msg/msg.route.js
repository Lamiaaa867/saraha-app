import { Router } from "express";
import * as msgC from './msg.controller.js'
import { asynchandler } from "../../utils/errorhandling.js";

const router= Router()
router.post('/send',asynchandler(msgC.sendMsg))
router.get('/get',asynchandler(msgC.getMsg))
router.delete('/del',asynchandler(msgC.delMsg))

export default router