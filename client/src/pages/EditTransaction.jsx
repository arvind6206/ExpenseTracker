import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function EditTransaction({ onClose, onSuccess, transaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["Food", "Travel", "Bills", "Shopping", "Salary", "Other"];

  useEffect(() => {
    if (transaction) {
      try {
        setTitle(transaction.title || "");
        setAmount(transaction.amount ? Math.abs(transaction.amount).toString() : "");
        setType(transaction.amount < 0 ? "expense" : "income");
        setCategory(transaction.category || "Food");
        setDate(transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading transaction data");
        console.error(err);
      }
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/transactions/${transaction._id}`, {
        title,
        amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
        category: category === "Other" ? customCategory : category,
        date,
      });
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating transaction");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
          <p>Loading transaction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-xl font-bold text-indigo-600 mb-4">
          Edit Transaction
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

        <select
          className="w-full p-3 mb-3 border rounded-lg"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="w-full p-3 mb-3 border rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {category === "Other" && (
          <input
            type="text"
            placeholder="Custom Category"
            className="w-full p-3 mb-3 border rounded-lg"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}

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
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
