import Resizer from "react-image-file-resizer";
import axios from "axios";

export default function ImageUpload({ ad, setAd }) {
  
  const handleUpload = async (e) => {
    try {
      let files = e.target.files;
      files = [...files]; // Convert FileList to Array
      if (files?.length) {
        setAd({ ...ad, uploading: true });

        // Iterate through files for resizing and uploading
        files.map((file) =>
          new Promise(() => {
            Resizer.imageFileResizer(
              file,
              1080,
              720,
              "JPEG",
              100,
              0,
              async (uri) => {
                console.log(uri);
                
                try {    
                  // Upload the resized image
                  const { data } = await axios.post("/upload-image", {
                    image:uri,
                  });

                  console.log("Uploaded image response:", data);

                  // Update ad state with the uploaded photo
                  setAd((prev) => ({
                    ...prev,
                    photos: [data, ...prev.photos],
                    uploading: false,
                  }));
                } catch (err) {
                  console.log("Error during image upload:", err);
                  setAd({ ...ad, uploading: false });
                }
              },
              "base64"
            );
          })
        );
      }
    } catch (err) {
      console.error("Error in handleUpload:", err);
      setAd({ ...ad, uploading: false });
    }
  };

  const handleDelete = async () => {
    try {
      setAd({ ...ad, uploading: true });

      // Add image deletion logic here if needed

      setAd({ ...ad, uploading: false });
    } catch (err) {
      console.error("Error in handleDelete:", err);
      setAd({ ...ad, uploading: false });
    }
  };

  return (
    <>
      <label className="btn btn-secondary mb-4">
        {ad.uploading ? "Processing..." : "Upload Photos"}
        <input
          onChange={handleUpload}
          type="file"
          accept="image/*"
          multiple
          hidden
        />
      </label>
    </>
  );
}
