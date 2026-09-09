import React, { useState, useEffect } from "react";
import api from "../api";
import Category from "../components/Category";
import Transaction from "../components/Transaction";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Calendar, Plus } from "lucide-react";

import Modal from "../components/Modal";
import { getIconComponent } from "../utils/iconOptions";
import { FILTER_OPTIONS, toISODate, formatMonthLabel } from "../utils/formatDate"
import DonutChart from "../components/DonutChart";
import TransactionBarChart from "../components/TransactionBarChart";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [transctions, setTransctions] = useState([]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [filterType, setFilterType] = useState("all");
  const [customDate, setCustomDate] = useState(toISODate(new Date()));

  const [selectedMonth, setSelectedMonth] = useState(toISODate(new Date()).slice(0, 7));

  const [viewMode, setViewMode] = useState("list");
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
    gettransctions();
  }, []);

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getCategories = () => {
    api
      .get("api/category/")
      .then((res) => {setCategories(res.data)
      console.log("Category Get :",res.data)})
      .catch((err) => console.log(err));
  };

  const gettransctions = () => {
    api
      .get("api/transaction/")
      .then((res) => {
        console.log("transaction GET :",res.data)
        setTransctions(res.data)
      })
      .catch((err) => console.log(err));
  };

  const deleteCategory = (id) => {
    api
      .delete(`api/category/detail/${id}/`)
      .then(() => setCategories(categories.filter((cat) => cat.id !== id)))
      .catch((err) => console.log(err));
  };

  const deleteTransaction = (id) => {
    api
      .delete(`api/transaction/detail/${id}/`)
      .then(() => setTransctions(transctions.filter((tran) => tran.id !== id)))
      .catch((err) => console.log(err));
  };

  const getCategoryName = (id) => {
    const found = categories.find((cat) => cat.id === id);
    return found ? found.name : "ไม่มี category";
  };

  const getCategoryIcon = (id) => {
    const found = categories.find((cat) => cat.id === id);
    return found ? getIconComponent(found.icon) : null;
  };

  const getCategoryColor = (id) => {
    const found = categories.find((cat) => cat.id === id);
    return found?.color || "#9ca3af";
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };
  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const openCreateTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };
  const openEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };
  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transctions.filter((tx) => {
    const today = new Date();

    if (filterType === "all") return true;

    if (filterType === "today") {
      return tx.date === toISODate(today);
    }

    if (filterType === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return tx.date === toISODate(yesterday);
    }

    if (filterType === "week") {
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return tx.date >= toISODate(monday) && tx.date <= toISODate(sunday);
    }

    if (filterType === "month") {
      return tx.date.slice(0, 7) === toISODate(today).slice(0, 7);
    }

    if (filterType === "custom") {
      return tx.date === customDate;
    }

    return true;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = totalIncome - totalExpense;

  const availableMonths = (() => {
    const monthsSet = new Set(transctions.map((tx) => tx.date.slice(0, 7)));
    monthsSet.add(toISODate(new Date()).slice(0, 7));
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  })();

  const selectedMonthTransactions = transctions.filter(
    (tx) => tx.date.slice(0, 7) === selectedMonth
  );

  const pieDataByType = (type) => {
    const grouped = {};

    selectedMonthTransactions
      .filter((tx) => tx.type === type)
      .forEach((tx) => {
        const name = getCategoryName(tx.category);
        const color = getCategoryColor(tx.category);
        if (!grouped[name]) {
          grouped[name] = { name, value: 0, color };
        }
        grouped[name].value += Number(tx.amount);
      });

    return Object.values(grouped);
  };

  const incomePieData = pieDataByType("income");
  const expensePieData = pieDataByType("expense");
  const incomeTotal = incomePieData.reduce((sum, d) => sum + d.value, 0);
  const expenseTotal = expensePieData.reduce((sum, d) => sum + d.value, 0);

  const barData = (() => {
    const grouped = {};

    transctions.forEach((tx) => {
      const month = tx.date.slice(0, 7);
      if (!grouped[month]) {
        grouped[month] = { month, income: 0, expense: 0 };
      }
      grouped[month][tx.type] += Number(tx.amount);
    });

    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  })();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-24">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <button onClick={Logout} className="border rounded-2xl px-2 bg-red-500 shadow-2xl text-white font-bold justify-end hover:bg-red-700">Logout</button>
      </div>
      

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-green-100 bg-green-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">รายรับ</p>
            <p className="text-lg font-bold text-green-600">
              +{totalIncome.toLocaleString()} ฿
            </p>
          </div>

          <div className="border border-red-100 bg-red-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">รายจ่าย</p>
            <p className="text-lg font-bold text-red-500">
              -{totalExpense.toLocaleString()} ฿
            </p>
          </div>

          <div className="border border-blue-100 bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">คงเหลือ</p>
            <p className={`text-lg font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {balance.toLocaleString()} ฿
            </p>
          </div>
        </div>
      </div>

      {/* ---------- กล่อง Category: list + ปุ่ม "+" ---------- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Categories</h2>
          <button
            onClick={openCreateCategory}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            <Plus size={16} />
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-400 text-xs">ยังไม่มี category</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const IconComp = getIconComponent(cat.icon);
              return (
                <div
                  key={cat.id}
                  className="group flex items-center gap-2 pl-2 pr-1 py-1 border border-gray-200 rounded-full hover:bg-gray-50 transition"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.color || "#e5e7eb" }}
                  >
                    {IconComp && <IconComp size={11} className="text-white" />}
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{cat.name}</span>

                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEditCategory(cat)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded-full"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Transactions</h2>
          <span className="text-xs text-gray-400">{filteredTransactions.length} รายการ</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            รายการ
          </button>

          <button
            onClick={() => setViewMode("pie")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              viewMode === "pie"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            สรุปรายเดือน
          </button>

          <button
            onClick={() => setViewMode("bar")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              viewMode === "bar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            เปรียบเทียบรายเดือน
          </button>
        </div>

        
        {viewMode === "pie" && (
          <div className="mb-2">
            <div className="flex items-center justify-end mb-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">
                  รายรับ · {formatMonthLabel(selectedMonth)}
                </h3>
                {incomePieData.length === 0 ? (
                  <p className="text-gray-400 text-xs py-16 text-center">ยังไม่มีข้อมูล</p>
                ) : (
                  <>
                    <DonutChart data={incomePieData} total={incomeTotal} centerLabel="รายรับ" />
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {incomePieData.map((entry, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></span>
                          <span className="text-xs text-gray-500">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">
                  รายจ่าย · {formatMonthLabel(selectedMonth)}
                </h3>
                {expensePieData.length === 0 ? (
                  <p className="text-gray-400 text-xs py-16 text-center">ยังไม่มีข้อมูล</p>
                ) : (
                  <>
                    <DonutChart data={expensePieData} total={expenseTotal} centerLabel="รายจ่าย" />
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {expensePieData.map((entry, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></span>
                          <span className="text-xs text-gray-500">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        
        {viewMode === "bar" && (
          <div className="mb-2">
            <TransactionBarChart data={barData} />
          </div>
        )}

        
        {viewMode === "list" && (
          <>
            {/* Filter bar */}
            <div className="flex items-center gap-2 flex-wrap mb-4 pb-4 border-b border-gray-100">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterType(opt.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    filterType === opt.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {filterType === "custom" && (
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-1">
                  <Calendar size={13} className="text-gray-500" />
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="bg-transparent text-xs text-gray-700 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {filteredTransactions.length === 0 ? (
              <p className="text-gray-400 text-xs">ไม่มีรายการในช่วงนี้</p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-150 overflow-y-auto pb-2">
                {filteredTransactions.map((tx) => {
                  const IconComp = getCategoryIcon(tx.category);
                  const color = getCategoryColor(tx.category);
                  return (
                    <li key={tx.id} className="group flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {IconComp && <IconComp size={13} className="text-white" />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {getCategoryName(tx.category)}
                            {tx.note && (
                              <span className="text-gray-400 font-normal"> ({tx.note})</span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400">{tx.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-sm font-semibold ${
                            tx.type === "income" ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {tx.amount} ฿
                        </span>

                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEditTransaction(tx)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded-full"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>

      
      <button
        onClick={openCreateTransaction}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">สร้างรายการ</span>
      </button>

      
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        title={editingCategory ? "แก้ไข Category" : "เพิ่ม Category ใหม่"}
      >
        <Category
          categories={categories}
          setCategories={setCategories}
          editingCategory={editingCategory}
          onClose={closeCategoryModal}
        />
      </Modal>

      
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        title={editingTransaction ? "แก้ไข Transaction" : "สร้างรายการ"}
      >
        <Transaction
          categories={categories}
          transctions={transctions}
          setTransctions={setTransctions}
          editingTransaction={editingTransaction}
          onClose={closeTransactionModal}
        />
      </Modal>
    </div>
  );
};

export default Home;