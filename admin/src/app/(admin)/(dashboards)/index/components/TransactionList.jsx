import { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  Success: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-purple-100 text-purple-700",
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`
      );
      if (data.success) {
        setTransactions(data.data);
        setFiltered(data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search filter
  useEffect(() => {
    const filteredData = transactions.filter((t) =>
      t.customer?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  }, [search, transactions]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // 📤 Export CSV
  const exportToCSV = () => {
    const headers = ["Txn ID", "Customer", "Order", "Amount", "Status", "Date"];
    const rows = filtered.map((t) => [
      t._id,
      t.customer?.name || "N/A",
      t.order?.productName || "N/A",
      t.amount,
      t.status,
      new Date(t.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transactions.csv";
    link.click();
  };

  if (loading)
    return (
      <div className="card p-6 text-center text-gray-500">Loading transactions...</div>
    );

  return (
    <div className="card bgdark:text-white">
      <div className="card-body">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between  items-center mb-4 gap-3 border-b pb-3">
          <h2 className="text-lg bgdark:text-white font-semibold ">
            All Transactions
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full md:w-56"
            />
            <button
              onClick={exportToCSV}
              className="btn btn-sm bg-primary text-white hover:bg-primary/90"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bgdark:text-white text-sm ">
            <thead>
              <tr className=" bgdark:text-white  text-sm">
                <th className="px-4 py-3 text-left font-medium">Txn ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((t) => (
                  <tr
                    key={t._id}
                    className=" transition duration-150"
                  >
                    <td className="px-4 py-3 font-medium ">
                      #{t._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3">{t.customer?.name || "N/A"}</td>
                    <td className="px-4 py-3">{t.order?.productName || "N/A"}</td>
                    <td className="px-4 py-3 font-medium ">
                      ₹{t.amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1.5 rounded-full text-xs font-semibold ${
                          statusColors[t.status] || "bg-gray-100 "
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 ">
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
                    className="text-center py-6  italic"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-5 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
