import { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  Success: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-purple-100 text-purple-700",
};

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`
      );
      if (data.success) setTransactions(data.data);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className=" rounded-2xl shadow-sm p-6 text-center text-gray-500">
        Loading transactions...
      </div>
    );

  return (
    <div className=" bg-card rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-lg font-semibold text-default-700">All Transactions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-card text-default-700 text-sm">
              <th className="px-4 py-3 text-left font-medium">Txn ID</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Order</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y  text-sm text-default-700">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr
                  key={t._id}
                  className="bg-card  transition-colors duration-150"
                >
                  <td className="px-4 py-3 font-medium text-default-800">
                    #{t._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3">{t.customer?.name || "N/A"}</td>
                  <td className="px-4 py-3">{t.order?.productName || "N/A"}</td>
                  <td className="px-4 py-3 font-medium text-default-800">
                    ₹{t.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1.5 rounded-full text-xs font-semibold ${statusColors[t.status] || "bg-card text-default-700"}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-default-700">
                    {new Date(t.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-default-800 italic"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
