import AddTransaction from "../pages/AddTransaction";
import { useNavigate } from "react-router-dom";

export default function AddTransactionPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AddTransaction
        onClose={() => navigate("/dashboard")}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
}
