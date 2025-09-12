import { useState, useEffect } from "react";
import axios from "axios";
import { FiTag, FiCalendar, FiX, FiPlus, FiArrowLeft } from "react-icons/fi";
import {  AnimatePresence } from "framer-motion";

const categories = {
  income: [
    { name: 'Salary', icon: '💵' },
    { name: 'Freelance', icon: '💼' },
    { name: 'Investment', icon: '📈' },
    { name: 'Gift', icon: '🎁' },
    { name: 'Other', icon: '📌' }
  ],
  expense: [
    { name: 'Food', icon: '🍔' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Bills', icon: '💡' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Health', icon: '🏥' },
    { name: 'Other', icon: '📌' }
  ]
};

export default function AddTransaction({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: categories.expense[0].name,
    customCategory: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.category === 'Other') {
      setShowCustomCategory(true);
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, customCategory: '' }));
    }
  }, [formData.category]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    
    // Parse the amount from formatted string
    const amount = parseCurrencyInput(formData.amount);
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount)) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Custom category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Parse the formatted amount back to a number
      const amount = parseCurrencyInput(formData.amount);
      const transactionData = {
        title: formData.title.trim(),
        amount: formData.type === "expense" 
          ? -Math.abs(amount) 
          : Math.abs(amount),
        category: formData.category === "Other" 
          ? formData.customCategory.trim() 
          : formData.category,
        date: formData.date,
      };
      
      console.log('Submitting transaction:', transactionData);
      
      const response = await axios.post("http://localhost:5000/api/transactions", transactionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Transaction response:', response.data);
      onSuccess();
    } catch (error) {
      setErrors({
        ...errors,
        submit: error.response?.data?.message || "Error adding transaction. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrencyInput = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Convert to number and format with Indian numbering system
    const number = parseInt(digits || '0', 10);
    return isNaN(number) ? '' : number.toLocaleString('en-IN');
  };
  
  const formatCurrencyDisplay = (value) => {
    if (!value) return '';
    const formatted = formatCurrencyInput(value);
    return formatted ? `Rs ${formatted}` : '';
  };

  const parseCurrencyInput = (value) => {
    return parseInt(value.replace(/\D/g, ''), 10) || 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount field
    if (name === 'amount') {
      const formattedValue = formatCurrencyInput(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const currentCategories = formData.type === 'income' ? categories.income : categories.expense;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-500">
          <div className="flex items-center justify-between p-4 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              Add Transaction
            </h2>
            <div className="w-9"></div> {/* For alignment */}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">

          {/* Transaction Type Toggle */}
          <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: t, category: categories[t][0].name }))}
                className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                  formData.type === t
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">Rs</span>
              </div>
              <input
                type="text"
                name="amount"
                inputMode="numeric"
                placeholder="0"
                className={`block w-full pl-12 pr-3 py-3 border ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                placeholder="e.g., Groceries, Salary, etc."
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {currentCategories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    formData.category === cat.name
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-medium text-gray-700">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Category Input */}
          <AnimatePresence>
            {showCustomCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Category
                </label>
                <input
                  type="text"
                  name="customCategory"
                  placeholder="Enter category name"
                  className={`block w-full px-4 py-3 border ${
                    errors.customCategory ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  value={formData.customCategory}
                  onChange={handleInputChange}
                />
                {errors.customCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.customCategory}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Transaction
                </>
              )}
            </button>
            
            {errors.submit && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                {errors.submit}
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
