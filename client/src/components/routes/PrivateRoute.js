import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";

export default function PrivateRoute() {
  const [auth, setAuth] = useAuth();
  const [ok, setOk] = useState();

  useEffect(() => {
    if (auth?.token) getCurrentUser();
  }, [auth?.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get("/current-user", {
        headers: {
          Authorization: auth?.token,
        },
      });
      setOk(true);
    } catch (err) {
      setOk(false);
    }
  };
  return ok ? <Outlet /> : "";
}
