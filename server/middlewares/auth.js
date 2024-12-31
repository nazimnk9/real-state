import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const requireSignin = ( req, res, next ) => {
    try {
        const decoded = Jwt.verify(req.headers.authorization, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const filterSensitiveData = (req, res, next) => {
    if (req.body.image) {
      console.log("Base64 data detected and filtered.",req.body.image);
      req.filteredImage = req.body.image; // Store the image for further use
      //req.body.image = undefined; // Clear the image from the request body
    }
    next();
  };