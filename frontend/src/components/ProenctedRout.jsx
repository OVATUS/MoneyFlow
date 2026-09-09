import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from ".././api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from ".././constants";

const ProenctedRout = ({ children }) => {
// children คือสิ่งที่อยู่ระหว่าง <ProenctedRout>...</ProenctedRout> ตอนถูกเรียกใช้
  const [isAuthorized, setIsAuthorized] = useState(null); //false

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("api/token/refresh/", {
        refresh: refreshToken,
      });
      //  ข้อมูลที่จะส่งไปด้วย (body) refresh : refreshToken
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        //การ set ค่า key, value เก็บ  Accesstoken จาก res.data.access ไว้กับ ACCESS_TOKEN
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decode = jwtDecode(token);
    const tokenExpiration = decode.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div> Loading.... eieiei</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProenctedRout;
