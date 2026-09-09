import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <p className="text-6xl font-bold text-gray-300">404</p>
      <h1 className="text-xl font-semibold text-gray-700 mt-2">
        ไม่พบหน้านี้
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        หน้าที่คุณกำลังหาอาจถูกย้ายหรือไม่มีอยู่
      </p>

      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
};

export default NotFound;