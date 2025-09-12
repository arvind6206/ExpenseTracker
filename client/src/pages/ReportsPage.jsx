import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Calendar, Filter, DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon,
  BarChart2, LineChart as LineChartIcon, Download, RefreshCw, PlusCircle, LogOut
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const timeRanges = [
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 3 Months', value: '90' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: 'all' },
];

const chartTypes = [
  { label: 'Bar', value: 'bar', icon: <BarChart2 size={16} /> },
  { label: 'Line', value: 'line', icon: <LineChartIcon size={16} /> },
  { label: 'Area', value: 'area', icon: <AreaChart width={16} height={16} /> },
  { label: 'Pie', value: 'pie', icon: <PieChartIcon size={16} /> },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30');
  const [chartType, setChartType] = useState('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    summary: { totalIncome: 0, totalExpenses: 0, net: 0 },
    byCategory: [],
    overTime: [],
    recentTransactions: []
  });

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axios.get(
        `http://localhost:5000/api/transactions/reports?timeRange=${timeRange}&_=${timestamp}`, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
      
      // Force a re-render with the new data
      setReportData({
        summary: response.data.summary || { totalIncome: 0, totalExpenses: 0, net: 0 },
        byCategory: response.data.byCategory || [],
        overTime: response.data.overTime || [],
        recentTransactions: response.data.recentTransactions || []
      });
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Reset to empty state on error
      setReportData({
        summary: { totalIncome: 0, totalExpenses: 0, net: 0 },
        byCategory: [],
        overTime: [],
        recentTransactions: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    // Separate income and expenses for better visualization
    const incomeData = reportData.byCategory.filter(item => item.type === 'income');
    const expenseData = reportData.byCategory.filter(item => item.type === 'expense');
    
    // For bar/line/area charts, we want to show both income and expenses
    const data = chartType === 'pie' 
      ? (expenseData.length > 0 ? expenseData : incomeData) 
      : [...incomeData, ...expenseData];
    
    // Ensure we have valid data for the chart
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No data available for the selected time period
        </div>
      );
    }

    const chartContainer = (children) => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-200">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </div>
    );

    switch (chartType) {
      case 'bar':
        return chartContainer(
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="_id" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => `Rs ${new Intl.NumberFormat('en-IN').format(value)}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {expenseData.length > 0 && (
              <Bar 
                dataKey="total" 
                name="Expenses" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            )}
            {incomeData.length > 0 && (
              <Bar 
                dataKey="total" 
                name="Income" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            )}
          </BarChart>
        );
      case 'line':
        return chartContainer(
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="_id" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {expenseData.length > 0 && (
              <Line type="monotone" dataKey="total" name="Expenses" stroke="#ef4444" strokeWidth={2} />
            )}
            {incomeData.length > 0 && (
              <Line type="monotone" dataKey="total" name="Income" stroke="#10b981" strokeWidth={2} />
            )}
          </LineChart>
        );
      case 'area':
        return chartContainer(
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="_id" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {expenseData.length > 0 && (
              <Area type="monotone" dataKey="total" name="Expenses" fill="#fecaca" fillOpacity={0.6} stroke="#ef4444" strokeWidth={2} />
            )}
            {incomeData.length > 0 && (
              <Area type="monotone" dataKey="total" name="Income" fill="#a7f3d0" fillOpacity={0.6} stroke="#10b981" strokeWidth={2} />
            )}
          </AreaChart>
        );
      case 'pie':
        return chartContainer(
          <RePieChart>
            <Pie dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100} fill="#4f46e5" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
              {data.map((entry, index) => {
                // Use red for expenses, green for income
                const color = entry.type === 'expense' ? 
                  `rgba(239, 68, 68, ${0.6 + (0.4 * (index / data.length))})` : 
                  `rgba(16, 185, 129, ${0.6 + (0.4 * (index / data.length))})`;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
          </RePieChart>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return 'Rs ' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="p-6 w-full max-w-[99%] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Expense Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Analyze your spending and income patterns</p>
        </div>
        <button
          onClick={fetchReportData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh data"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl shadow transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400">Total Income</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-300">
                {formatCurrency(reportData.summary.totalIncome)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl shadow transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 dark:text-red-400">Total Expenses</p>
              <p className="text-xl font-bold text-red-900 dark:text-red-300">
                {formatCurrency(reportData.summary.totalExpenses)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400">Net Balance</p>
              <p className={`text-xl font-bold ${
                reportData.summary.net >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(reportData.summary.net)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              reportData.summary.net >= 0 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {reportData.summary.net >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <Calendar size={16} />
            </div>
          </div>
          <button
            onClick={fetchReportData}
            disabled={isLoading}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
          {chartTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setChartType(type.value)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === type.value
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              title={type.label}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {chartType === 'pie' 
              ? 'Expense Categories' 
              : chartType === 'bar' 
                ? 'Income vs Expenses' 
                : 'Transaction Trends'}
          </h2>
        </div>
        {renderChart()}
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {reportData.recentTransactions?.length > 0 ? (
            reportData.recentTransactions.map((transaction) => (
              <div key={transaction._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      transaction.amount >= 0 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {transaction.amount >= 0 ? (
                        <TrendingUp size={18} />
                      ) : (
                        <TrendingDown size={18} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{transaction.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {' • '}
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.amount >= 0 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No recent transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
