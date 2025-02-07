import express from "express";
import multer from "multer";
const router = express.Router();

import * as ad from "../controllers/ad.js";
import { requireSignin } from "../middlewares/auth.js";

router.post("/upload-image",requireSignin, ad.uploadImage)
router.post("/remove-image",requireSignin, ad.removeImage)
router.post("/ad",requireSignin, ad.create)


export default router