import Transaction from "../models/Transaction.js";
import mongoose from 'mongoose';

// Helper function to get date range based on time range
const getDateRange = (timeRange) => {
  const now = new Date();
  const fromDate = new Date();
  
  switch (timeRange) {
    case '7':
      fromDate.setDate(now.getDate() - 7);
      break;
    case '30':
      fromDate.setMonth(now.getMonth() - 1);
      break;
    case '90':
      fromDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      fromDate.setFullYear(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      fromDate.setFullYear(2000, 0, 1); // A date in the distant past
  }
  
  return { fromDate, toDate: now };
};

// @desc Get all transactions for logged-in user
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get a single transaction by ID
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a new transaction
export const addTransaction = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get transaction reports
// @route GET /api/transactions/reports
export const getTransactionReports = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const { fromDate, toDate } = getDateRange(timeRange);
    
    // Get transactions for the selected time range
    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: fromDate, $lte: toDate }
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          net: 0
        },
        byCategory: [],
        recentTransactions: []
      });
    }

    // Calculate summary
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.amount > 0) {
          acc.totalIncome += transaction.amount;
        } else if (transaction.amount < 0) {
          // Keep expenses as negative numbers for accurate calculations
          acc.totalExpenses += Math.abs(transaction.amount);
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, net: 0 }
    );

    console.log('Raw values - Income:', summary.totalIncome, 'Expenses:', summary.totalExpenses);
    
    // Calculate net balance (income - expenses)
    summary.net = summary.totalIncome - summary.totalExpenses;
    
    console.log('After processing - Income:', summary.totalIncome, 
                'Expenses:', summary.totalExpenses, 
                'Net:', summary.net);

    // Group by category
    const categoryMap = new Map();
    
    transactions.forEach(transaction => {
      const amount = transaction.amount;
      const category = transaction.category;
      const isExpense = amount < 0;
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { 
          _id: category, 
          total: 0, 
          count: 0,
          type: isExpense ? 'expense' : 'income'
        });
      }
      
      const categoryData = categoryMap.get(category);
      categoryData.total += Math.abs(amount);
      categoryData.count += 1;
    });

    const byCategory = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);

    // Get recent transactions (last 5)
    const recentTransactions = await Transaction.find({
      user: req.user._id
    })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    res.json({
      summary,
      byCategory,
      recentTransactions
    });
    
  } catch (error) {
    console.error('Error generating reports:', error);
    res.status(500).json({ message: 'Error generating reports' });
  }
};
