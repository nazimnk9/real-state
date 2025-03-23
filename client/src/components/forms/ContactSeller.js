import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Link, useNavigate } from "react-router-dom";

export default function ContactSeller({ ad }) {
    //context
    const [auth, setAuth] = useAuth()
    //state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState("")
    //hooks
    const navigate = useNavigate();
    return <>
        <div className="row">
            <div className="col-lg-8 offset-lg-2">
                <h3>
                    Contact{" "}
                    {ad?.postedBy?.name ? ad?.postedBy?.name : ad?.postedBy?.username}
                </h3>
            </div>
        </div>
    </>;
}