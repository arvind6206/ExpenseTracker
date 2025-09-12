import express from "express";
import {
  getTransactions,
  getTransaction,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionReports,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getTransactions)   // Get all transactions for logged-in user
  .post(protect, addTransaction);  // Add transaction

// Reports route
router.get("/reports", protect, getTransactionReports);

router.route("/:id")
  .get(protect, getTransaction)    // Get single transaction
  .put(protect, updateTransaction) // Update transaction
  .delete(protect, deleteTransaction); // Delete transaction

export default router;
