import express from "express";
import multer from "multer";
const router = express.Router();

import * as ad from "../controllers/ad.js";
import { requireSignin } from "../middlewares/auth.js";

router.post("/upload-image",requireSignin, ad.uploadImage)

//router.post("/upload-image", requireSignin, (req, res) => ad.uploadImage(req, res));


export default router