import { useState, useEffect } from "react";
import axios from "axios";

export default function TransactionForm({ onClose, onSuccess, editTx }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editTx) {
      setTitle(editTx.title);
      setAmount(editTx.amount);
      setCategory(editTx.category);
      setDate(editTx.date.split("T")[0]);
    }
  }, [editTx]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTx) {
        await axios.put(`http://localhost:5000/api/transactions/${editTx._id}`, {
          title,
          amount,
          category,
          date,
        });
      } else {
        await axios.post("http://localhost:5000/api/transactions", {
          title,
          amount,
          category,
          date,
        });
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving transaction");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-xl font-bold text-indigo-600 mb-4">
          {editTx ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 mb-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-3 mb-3 border rounded-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full p-3 mb-3 border rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-3 mb-4 border rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {editTx ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
