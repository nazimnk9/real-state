import { useState,useEffect } from "react";
import Sidebar from "../../components/nav/Sidebar";
import { useAuth } from "../../context/auth";
import axios from "axios"
import UserAdCard from "../../components/cards/UserAdCard";
export default function Dashboard() {
    //context
    const [auth,setAuth] = useAuth()

    //state
    const [ads,setAds] = useState()
    const [total,setTotal] = useState()

    const seller = auth.user?.role?.includes("Seller");

    useEffect(()=>{
        fetchAds()
    },[auth.token != ""])

    const fetchAds = async () => {
        try{
           const {data} =  await axios.get("/user-ads");
           setAds(data.ads);
           setTotal(data.total);
        }catch(err){
            console.log(err);
            
        }
    }

    return(
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Dashboard</h1>
            <Sidebar />
            {!seller ? (
                <div className="d-flex justify-content-center align-items-center vh-100" style={{marginTop: "-10%"}}>
                    <h2>Hey {auth?.user.name ? auth?.user.name : auth?.user.username}, Welcome to Real Estate App</h2>
                </div>
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
                            <p className="text-center">Total {total} ads found</p>
                        </div>
                    </div>
                    <div className="row">
                        {ads?.map((ad) =>(<UserAdCard ad={ad} />))}
                    </div>
                </div>
            )}
        </div>
    );
}