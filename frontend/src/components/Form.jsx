import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Form = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLogin = method === "login";
  const title = isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก";

  const handleSummit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(route, { username, password });
      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSummit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6"
      >
        <h1 className="text-lg font-semibold text-gray-800 mb-5 text-center">
          {title}
        </h1>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white text-sm rounded-md py-2 mt-1 hover:bg-blue-700 transition"
          >
            {title}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          {isLogin ? (
            <>
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                สมัครสมาชิก
              </Link>
            </>
          ) : (
            <>
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                เข้าสู่ระบบ
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Form;