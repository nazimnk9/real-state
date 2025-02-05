import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as config from "../config.js";
import { nanoid } from "nanoid";

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
    res.status(200).send({ Location: downloadURL, Key: fileName  });
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