import express from "express";

const router = express.Router();

import * as ad from "../controllers/ad.js";
import { requireSignin } from "../middlewares/auth.js";

router.post("/upload-image",requireSignin, ad.uploadImage)


export default router