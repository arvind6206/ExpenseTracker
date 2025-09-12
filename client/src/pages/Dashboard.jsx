import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Edit2, Trash2, PlusCircle, TrendingUp, PieChart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Chart colors
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#A4DE6C', '#D0ED57', '#8884D8', '#82CA9D'
  ];

  // fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/transactions`);
      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  // totals
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = income + expense;

  // Prepare data for income vs expense pie chart
  const incomeExpenseData = [
    { name: 'Income', value: Math.max(0, income) },
    { name: 'Expense', value: Math.abs(Math.min(0, expense)) }
  ].filter(item => item.value > 0);

  // Prepare data for expense categories
  const expenseCategories = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += Math.abs(curr.amount);
      } else if (curr.category) {
        acc.push({
          name: curr.category,
          value: Math.abs(curr.amount)
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Prepare data for monthly expenses
  const monthlyData = Array(12).fill(0).map((_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    amount: 0
  }));

  transactions
    .filter(t => t.amount < 0) // Only expenses
    .forEach(t => {
      const month = new Date(t.date).getMonth();
      monthlyData[month].amount += Math.abs(t.amount);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[99%] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Dashboard</h1>
        <button
          onClick={() => navigate("/add-transaction")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle size={18} /> Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-indigo-100 dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">Total Transactions</p>
          <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{transactions.length}</h2>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl shadow transition-colors duration-200">
          <p className="text-sm text-green-700 dark:text-green-400">Income</p>
          <h2 className="text-xl font-bold text-green-900 dark:text-green-300">₹{income}</h2>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl shadow transition-colors duration-200">
          <p className="text-sm text-red-700 dark:text-red-400">Expense</p>
          <h2 className="text-xl font-bold text-red-900 dark:text-red-300">₹{Math.abs(expense)}</h2>
        </div>
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow transition-colors duration-200">
          <p className="text-sm text-blue-700 dark:text-blue-400">Balance</p>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">₹{balance}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Income vs Expense Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Income vs Expenses</h2>
            <PieChart className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent, value }) => 
                    `${name}: ₹${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Income' ? '#10B981' : '#EF4444'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, name]} 
                />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Expenses Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Expenses</h2>
            <TrendingUp className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Legend />
                <Bar
                  type="monotone"
                  dataKey="amount"
                  name="Expenses"
                  fill="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Transactions</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button 
              onClick={() => navigate('/add-transaction')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <PlusCircle size={16} />
              Add Transaction
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{tx.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tx.category} • {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className={`font-bold ${
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                  </p>
                  <button
                    className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    onClick={() => navigate(`/edit-transaction/${tx._id}`)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                    onClick={() => handleDelete(tx._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
