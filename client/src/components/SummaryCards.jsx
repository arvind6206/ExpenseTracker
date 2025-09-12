export default function SummaryCard({ title, amount, type }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow ${
        type === "income" ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <p className="text-gray-600">{title}</p>
      <h3
        className={`text-2xl font-bold ${
          type === "income" ? "text-green-700" : "text-red-700"
        }`}
      >
        ₹{amount}
      </h3>
    </div>
  );
}
