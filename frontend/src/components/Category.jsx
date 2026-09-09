import React, { useState, useEffect } from "react";
import api from "../api";
import { ICON_OPTIONS } from "../utils/iconOptions";

const Category = ({ categories, setCategories, editingCategory, onClose }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setColor(editingCategory.color || "#3B82F6");
      setIcon(editingCategory.icon || "");
    } else {
      setName("");
      setColor("#3B82F6");
      setIcon("");
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      api
        .patch(`api/category/detail/${editingCategory.id}/`, { name, color, icon })
        .then((res) => {
          setCategories(
            categories.map((cat) => (cat.id === editingCategory.id ? res.data : cat))
          );
          onClose();
        })
        .catch((err) => console.log(err));
    } else {
      api
        .post("api/category/", { name, color, icon })
        .then((res) => {
          setCategories([...categories, res.data]);
          onClose();
        })
        .catch((err) => console.log("สร้างล้มเหลว:", err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="ชื่อ category"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500 w-10">สี</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <span className="text-sm text-gray-400">{color}</span>
      </div>

      <div>
        <label className="text-sm text-gray-500 block mb-2">Icon</label>
        <div className="flex gap-2 flex-wrap">
          {ICON_OPTIONS.map(({ name: iconName, Icon }) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setIcon(iconName)}
              className={`p-2 border rounded-lg transition ${
                icon === iconName
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          {editingCategory ? "บันทึก" : "สร้าง"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
};

export default Category;