import Sidebar from "../../components/nav/Sidebar";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import slugify from "slugify"
import ProfileUpload from "../../components/forms/ProfileUpload";
export default function Profile() {
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    //hook
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.user) {
            setUsername(auth.user?.username);
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setCompany(auth.user?.company);
            setAddress(auth.user?.address);
            setPhone(auth.user?.phone);
            setAbout(auth.user?.about);
            setPhoto(auth.user?.photo);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log({ username, name, email, company, address, phone, about, photo });

        } catch (err) {
            console.log(err);

        }
    }
    return (
        <>
            <h1 className="display-1 bg-primary text-light p-5">Profile</h1>
            <div className="container-fluid">
                <Sidebar />
                <div className="container mt-2">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-2">
                            <ProfileUpload
                                photo={photo}
                                setPhoto={setPhoto}
                                uploading={uploading}
                                setUploading={setUploading}
                            />
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Update your Username"
                                    className="form-control mb-4"
                                    value={username}
                                    onChange={(e) => setUsername(slugify(e.target.value.toLowerCase()))}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your Name"
                                    className="form-control mb-4"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    //placeholder="Enter your Name"
                                    className="form-control mb-4"
                                    value={email}
                                    disabled={true}
                                //onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your Company Name"
                                    className="form-control mb-4"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your Address"
                                    className="form-control mb-4"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your Phone"
                                    className="form-control mb-4"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <textarea
                                    placeholder="Write something interesting about yourself.."
                                    className="form-control mb-4"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    maxLength={200}
                                />
                                <button className="btn btn-primary col-12 mb-4" disabled={loading}>
                                    {loading ? "Processing" : "Update Profile"}
                                </button>
                            </form>
                        </div>
                    </div>
                    {/* <pre>{JSON.stringify({username,name,email,company,address,phone,about,photo})}</pre> */}
                </div>
            </div>
        </>
    )
}