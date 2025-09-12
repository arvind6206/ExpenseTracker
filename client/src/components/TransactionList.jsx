import { Edit2, Trash2 } from "lucide-react";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Transactions</h2>
      <ul className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <li
              key={tx._id}
              className="flex justify-between items-center py-4 hover:bg-gray-50 px-2 rounded-lg transition"
            >
              <div>
                <p className="font-medium text-gray-800">{tx.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.date).toLocaleDateString()} • {tx.category}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    tx.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.amount >= 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                </span>
                <button
                  className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600"
                  onClick={() => onEdit(tx)}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-red-100 text-red-600"
                  onClick={() => onDelete(tx._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
