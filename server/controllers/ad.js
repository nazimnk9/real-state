import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as config from "../config.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import { emailTemplate } from "../helpers/email.js";
import nodemailer from "nodemailer";

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Convert the base64 string to a buffer
    const base64Image = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];
    console.log("type", type);

    const fileName = `${nanoid()}.${type}`;

    // Initialize Firebase Storage
    const storage = getStorage(config.app);
    const storageRef = ref(storage, `images/${fileName}`);

    // Upload the file to Firebase Storage
    const metadata = {
      contentType: `image/${type}`,
    };

    await uploadBytes(storageRef, base64Image, metadata);

    // Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Respond with the URL
    res.status(200).send({ Location: downloadURL, Key: fileName });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Upload failed. Try again." });
  }
};

export const removeImage = async (req, res) => {
  try {
    const { Key, Location } = req.body;
    if (!Key || !Location) return res.status(400).json({ error: "Missing Key or Location" });

    // Reference the file in Firebase Storage
    const storage = getStorage(config.app);
    const fileRef = ref(storage, `images/${Key}`);

    // Delete the file
    await deleteObject(fileRef);

    res.send({ ok: true });
  } catch (err) {
    console.log("Error deleting image:", err);
    res.status(400).json({ error: "Image deletion failed" });
  }
};

export const create = async (req, res) => {
  try {
    console.log(req.body);
    const { photos, description, title, address, price, type, landsize } = req.body;
    if (!photos?.length) {
      return res.json({ error: "Photos are required" })
    }
    if (!price) {
      return res.json({ error: "Price is required" })
    }
    if (!type) {
      return res.json({ error: "Is property house or land?" })
    }
    if (!address) {
      return res.json({ error: "Address is required" })
    }
    if (!description) {
      return res.json({ error: "Description is required" })
    }

    // Fetch geocoding data from OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
    );
    const data = await response.json();
    const geo = data; // Take the first result

    console.log("geo", geo);

    // Save the ad with the geocoded data
    const ad = await new Ad({
      ...req.body,
      postedBy: req.user._id,
      location: {
        type: "Point",
        coordinates: [geo?.[0]?.lon, geo?.[0]?.lat]
      },
      googleMap: geo,
      slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`),
    }).save();
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { role: "Seller" },
    },
      { new: true }
    );
    user.password = undefined;
    user.resetCode = undefined;
    res.json({
      ad,
      user,
    })
    // res.json({ success: true, ad });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
}


export const ads = async (req, res) => {
  try {
    const adsForSell = await Ad.find({ action: "Sell" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);
    const adsForRent = await Ad.find({ action: "Rent" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json({ adsForSell, adsForRent })
  } catch (err) {
    console.log(err);

  }
}

export const read = async (req, res) => {
  try {
    const ad = await Ad.findOne({ slug: req.params.slug }).populate(
      "postedBy",
      "name username email phone company photo.Location"
    );
    // related
    const related = await Ad.find({
      _id: { $ne: ad._id },
      action: ad.action,
      type: ad.type,

      address: {
        $regex: ad.googleMap[0]?.name,
        $options: "i",
      },

    }).limit(3).select("-photos.Key -googleMap");
    //console.log(related);

    res.json({ ad, related })

  } catch (err) {
    console.log(err);

  }
}

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: req.body.adId }
    }, { new: true }
    );
    const { password, resetCode, ...rest } = user._doc
    res.json(rest);
  } catch (err) {
    console.log(err);

  }
}

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: req.params.adId }
    }, { new: true }
    );
    const { password, resetCode, ...rest } = user._doc
    res.json(rest);
  } catch (err) {
    console.log(err);

  }
}

export const contactSeller = async (req, res) => {
  try {
    const { name, email, message, phone, adId } = req.body;
    const ad = await Ad.findById(adId).populate("postedBy", "email");
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enquiredProperties: adId },
    });
    if (!user) {
      return res.json({ error: "Could not find user with that email" })
    } else {
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
          ad.postedBy.email,
          `
            <p>You have received a new customer enquiry</p>
            <h4>Customer details</h4>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>
            <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} ${ad.price}</a>
            `,
          email,
          "New enquiry received"
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
    }
  } catch (err) {
    console.log(err);

  }
}

export const userAds = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const total = await Ad.find({ postedBy: req.user._id });
    const ads = await Ad.find({ postedBy: req.user._id })
      .select("-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap")
      .populate("postedBy", "name email username phone company")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
    res.json({ ads, total: total.length })
  } catch (err) {
    console.log(err);

  }
}