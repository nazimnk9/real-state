import Sidebar from "../../components/nav/Sidebar";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export default function Settings() {
    //state
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            //console.log({ username, name, email, company, address, phone, about, photo });
            setLoading(true);
            const {data} = await axios.put("/update-password", {
                password,
            });
            if(data?.error){
                toast.error(data.error)
                setLoading(false)
            }else{
                setLoading(false)
                toast.success("Password Updated");
            }

        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }
    return (
        <>
            <h1 className="display-1 bg-primary text-light p-5">Settings</h1>
            <div className="container-fluid">
                <Sidebar />
                <div className="container mt-2">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-2">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="password"
                                    placeholder="Enter your Password"
                                    className="form-control mb-4"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button className="btn btn-primary col-12 mb-4" disabled={loading}>
                                    {loading ? "Processing" : "Update Password"}
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