import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../config";
import { nanoid } from "nanoid";
export const uploadImage = async (res, req) => {

  try {
    //console.log("Request received in controller:");
    //console.log("Request received in controller:", req);
    // console.log("Headers:", req.headers);
    console.log("Body2:", req.req.body);
     const { image } = req.req.body;
     //Convert the base64 string to a buffer
    const base64Image = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
  
      const type = image.split(";")[0].split("/")[1];
      console.log("type",type);
      
      const fileName = `${nanoid()}.${type}`;
  
      // Initialize Firebase Storage
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${fileName}`);
  
      // Upload the file to Firebase Storage
      const metadata = {
        contentType: `image/${type}`,
      };
  
      await uploadBytes(storageRef, base64Image, metadata);
  
      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
  
      // Respond with the URL
      res.status(200).send({ url: downloadURL });

    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Upload failed. Try again." });
    }
};
