import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import Validator from "email-validator";
import nodemailer from "nodemailer";

//const auth = getAuth();

export const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.password = undefined;
  user.resetCode = undefined;
  return res.json({
    token,
    refreshToken,
    user,
  });
};

export const welcome = (req, res) => {
  res.json({
    data: "hello from nodejs api from routes and controllers from *",
  });
};

export const preRegister = async (req, res) => {
  // create jwt with email and password then email as clickable link
  // only when user click on that email link, registeration completes
  try {
    //console.log(req.body);
    const { email, password } = req.body;

    if (!Validator.validate(email)) {
      return res.json({ error: "A valid email is required" });
    }
    if (!password) {
      return res.json({ error: "Password is required" });
    }
    if (password && password?.length < 8) {
      return res.json({ error: "Password should be at least 8 characters" });
    }
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.json({ error: "Email is taken" });
    }
    // //const result = await createUserWithEmailAndPassword(auth, email, password);

    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    // //console.log(token);

    const transporter = nodemailer.createTransport({
      /* Configure your email transport settings here */
      // For example, if you're using Gmail as your SMTP server:
      service: "Gmail",
      auth: {
        user: "mdnazimahmed64@gmail.com",
        pass: "wrdrygfjnqgygixe",
      },
    });

    // // Send email using Nodemailer
    // const mailOptions = {
    //   from: config.EMAIL_FROM,
    //   to: email,
    //   subject: 'Welcome to Real-State',
    //   html:
    //     `
    //       <p>Please click the link below to activate your account.</p>
    //       <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>

    //     `,
    // };

    transporter.sendMail(
      emailTemplate(
        email,
        `
      <p>Please click the link below to activate your account.</p>
      <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
      `,
        config.REPLY_TO,
        "Activate Your Account"
      ),
      (error, info) => {
        if (error) {
          console.log(error);
          return res.json({ ok: false });
        } else {
          console.log(info);
          return res.json({ ok: true });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
    //const decoded = jwt.verify(req.body.token, config.JWT_SECRET);
    //console.log(decoded);

    const userExist = await User.findOne({ email });
      if (userExist) {
        return res.json({ error: "Email is taken" });
    }
    //     //const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
    const hashedPassword = await hashPassword(password);
    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();
    
    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //     // 1 find user by email
    const user = await User.findOne({ email });
    //     // 2 compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Wrong password" });
    }
    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

// /* export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ error: "Could not find user with that email" });
//     } else {
//       const resetCode = nanoid();
//       user.resetCode = resetCode;
//       user.save();

//       const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
//         expiresIn: "1h",
//       });
//       await sendPasswordResetEmail(auth, email)
//         .then((data) => {
//           //console.log(data);
//           res.json({ token, });
//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           console.log(errorCode);
//           console.log(errorMessage);
//           return res.json({ errorMessage });
//         });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.json({ error: "Something went wrong. Try again." });
//   }
// }; */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } else {
      const resetCode = nanoid();
      user.resetCode = resetCode;
      await user.save();

      const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
        expiresIn: "1h",
      });

      const transporter = nodemailer.createTransport({
        /* Configure your email transport settings here */
        // For example, if you're using Gmail as your SMTP server:
        service: "Gmail",
        auth: {
          user: "mdnazimahmed64@gmail.com",
          pass: "wrdrygfjnqgygixe",
        },
      });
      transporter.sendMail(
        emailTemplate(
          email,
          `
        <p>Please click the link below to access your account.</p>
        <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>
        `,
          config.REPLY_TO,
          "Access Your Account"
        ),
        (error, info) => {
          if (error) {
            console.log(error);
            return res.json({ ok: false });
          } else {
            console.log(info);
            return res.json({ ok: true });
          }
        }
      );

      //       const mailOptions = {
      //         from: 'mdnazimahmed64@gmail.com', // Sender's email address
      //         to: email, // Recipient's email address
      //         subject: 'Access your account',
      //         html: `
      //           <p>Please click the link below to access your account.</p>
      //           <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>
      //         `,
      //       };

      //       transporter.sendMail(mailOptions, (error, info) => {
      //         if (error) {
      //           console.log(error);
      //           return res.json({ ok: false });
      //         } else {
      //           console.log('Email sent: ' + info.response);
      //           return res.json({ token });
      //         }
      //       });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

export const accessAccount = async (req, res) => {
  try {
    //     // const { email } = req.body;
    //     // // const user = await User.findOne({ email });
    //     // //const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);
    //     // const user = await User.findOneAndUpdate({ email });
    const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });

    tokenAndUserResponse(req, res, user);

    //     tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

export const refreshToken = async (req, res) => {
   try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
    const user = await User.findById(_id);
    //tokenAndUserResponse(req, res, user);
    tokenAndUserResponse(req, res, user);
   } catch (err) {
     console.log(err);
     return res.status(403).json({ error: "Refresh token failed" });
   }
 };

export const currentUser = async (req, res) => {
   try {
     const user = await User.findById(req.user._id);
     user.password = undefined;
     user.resetCode = undefined;
     return res.json(user);
   } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauthorized" });
   }
 };

export const publicProfile = async(req, res) => {
   try{
     const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    return res.json(user);
   }catch(err){
    console.log(err);
    return res.json({ error: "User not found."});
   }
};

export const updatePassword = async (req, res) => {
   try {
     const {password} = req.body;
     if(!password){
       return res.json({ error: "Password is required!"});
     }
    if (password && password?.length < 8) {
      return res.json({ error: "Password should be minimum 8 characters" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });
    res.json({ ok: true });
   } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

export const updateProfile = async (req, res) =>{
   try{
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
   }catch(err){
    console.log(err);
    if(err.codeName === "DuplicateKey"){
      return res.json({ error: "Username or email is already taken" });
    }else{
      return res.status(403).json({ error: "Unauthorized" });
     }
   }
 };
