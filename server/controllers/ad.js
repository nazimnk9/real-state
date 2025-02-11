import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as config from "../config.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";

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
      slug: slugify(`${type}-${address}-${price}${nanoid(6)}`),
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