import React, { useState, useEffect } from "react";
import api from "../api";
import { getIconComponent } from "../utils/iconOptions";

const Transaction = ({ categories, transctions, setTransctions, editingTransaction, onClose }) => {
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setCategoryId(editingTransaction.category ?? "");
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount);
      setNote(editingTransaction.note);
      setDate(editingTransaction.date);
    } else {
      setCategoryId("");
      setType("income");
      setAmount("");
      setNote("");
      setDate("");
    }
  }, [editingTransaction]);

  const createtransction = (e) => {
    e.preventDefault();

    if (editingTransaction) {
      api
        .patch(`api/transaction/detail/${editingTransaction.id}/`, {
          category: categoryId,
          type,
          amount,
          note,
          date,
        })
        .then((res) => {
          setTransctions(
            transctions.map((tran) =>
              tran.id === editingTransaction.id ? res.data : tran
            )
          );
          onClose();
        })
        .catch((err) => console.log(err));
    } else {
      api
        .post("api/transaction/", {
          category: categoryId,
          type,
          amount,
          note,
          date,
        })
        .then((res) => {
          setTransctions([...transctions, res.data]);
          onClose();
        })
        .catch((err) => console.log(err));
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === Number(categoryId));
  const SelectedIcon = selectedCategory ? getIconComponent(selectedCategory.icon) : null;

  return (
    <form onSubmit={createtransction} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-gray-200"
          style={{ backgroundColor: selectedCategory?.color || "#e5e7eb" }}
        >
          {SelectedIcon && <SelectedIcon size={18} className="text-white" />}
        </div>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">-- เลือก Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-1/3 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="จำนวนเงิน"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-1/3 p-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="โน้ต (ไม่บังคับ)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          {editingTransaction ? "บันทึกการแก้ไข" : "สร้าง Transaction"}
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

export default Transaction;