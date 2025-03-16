import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Avatar } from "antd"
//import { uploadImage } from "../../../../server/controllers/ad";
import { useAuth } from "../../context/auth";

export default function ProfileUpload({
    photo,
    setPhoto,
    uploading,
    setUploading
}) {
    //context
    const [auth, setAuth] = useAuth();
    const handleUpload = async (e) => {
        try {
            let file = e.target.files[0];
            if (file) {
                setUploading(true)
                // Iterate through files for resizing and uploading
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
                                //const { data } = await axios.post("/upload-image",{image:uri});
                                const { data } = await axios.post("/upload-image", { image: uri });

                                console.log("Uploaded image response:", data);

                                // Update ad state with the uploaded photo
                                setPhoto(data)
                                setUploading(false)
                            } catch (err) {
                                console.log("Error during image upload:", err);
                                setUploading(false)
                            }
                        },
                        "base64"
                    );
                })
            }
        } catch (err) {
            console.error("Error in handleUpload:", err);
            setUploading(false)
        }
    };

    const handleDelete = async (file) => {
        const answer = window.confirm("Delete Image?");
        if (!answer) return;
        // Debugging logs
        // console.log("Deleting file:", file);
        // console.log("File Key:", file.Key);
        // console.log("File Location:", file.Location);

        // if (!file.Key || !file.Location) {
        //     console.error("Error: Missing Key or Location", file);
        //     return;
        // }
        setUploading(true)
        try {
            const { data } = await axios.post("/remove-image", photo);

            if (data?.ok) {
                setPhoto(null)
                setUploading(false)
            }
        } catch (err) {
            console.error("Error in handleDelete:", err);
            setUploading(false)
        }
    };
    return (
        <>
            <label className="btn btn-secondary mb-4 mt-4">
                {uploading ? "Processing..." : "Upload Photos"}
                <input
                    onChange={handleUpload}
                    type="file"
                    accept="image/*"
                    //multiple
                    hidden
                />
            </label>
            {photo?.Location ? (
                <Avatar
                    src={photo?.Location}
                    shape="square"
                    size="46"
                    className="ml-2 mb-4 mt-4"
                    onClick={() => handleDelete()}
                />
            ) : (

                ""
            )}
        </>
    );
}
