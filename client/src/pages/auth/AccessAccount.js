import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import axios from "axios"
import {useAuth} from "../../context/auth"

export default function AccessAccount() {
  const [auth, setAuth] = useAuth()
  const { token } = useParams();
  const navigate = useNavigate()
  //console.log(token);

  useEffect(()=>{
    if(token) requestAccess();
  },[token])

  const requestAccess = async() =>{
    try {
      const {data} = await axios.post(`/access-account`,{resetCode: token})
      if(data?.error){
        toast.error(data.error)
      }else{
        localStorage.setItem("auth",JSON.stringify(data))
        setAuth(data)
        toast.success("Please update your password in profile page")
        navigate("/")
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Try Again.")
      
    } finally {
      
    }
  }

  return (
    <div
      className="display-1 d-flex justify-content-center align-items-center vh-100"
      style={{ marginTop: "-5%" }}
    >
      Please Wait...
    </div>
  );
}
