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