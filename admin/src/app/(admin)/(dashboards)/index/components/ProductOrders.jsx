import { useEffect, useState } from "react";
import axios from "axios";
import {
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuEllipsis,
  LuEye,
  LuSearch,
  LuSquarePen,
  LuTrash2,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import OrderEditModal from "../../../(app)/(ecommerce)/orders/components/OrderEditModal";

const statusClasses = {
  Delivered: "bg-success/10 text-success border border-success/30",
  Shipping: "bg-info/10 text-info border border-info/30",
  New: "bg-secondary/10 text-secondary border border-secondary/30",
  Pending: "bg-warning/10 text-warning border border-warning/30",
  Cancelled: "bg-danger/10 text-danger border border-danger/30",
};

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [orders, search]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const handleSearch = (value) => {
    setSearch(value);
    const filtered = orders.filter(
      (order) =>
        order.customerName?.toLowerCase().includes(value.toLowerCase()) ||
        order.orderId?.toLowerCase().includes(value.toLowerCase()) ||
        order.paymentMethod?.toLowerCase().includes(value.toLowerCase()) ||
        order.deliveryStatus?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Delete Order
  const deleteOrder = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const csvHeaders = [
      "Order ID",
      "Customer Name",
      "Amount",
      "Payment Method",
      "Payment Status",
      "Delivery Status",
    ];
    const csvRows = orders.map((o) => [
      o.orderId,
      o.customerName,
      o.amount,
      o.paymentMethod,
      o.paymentStatus,
      o.deliveryStatus,
    ]);
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return <p className="text-center py-5">Loading orders...</p>;

  return (
    <div className="grid grid-cols-1 gap-5 mb-5">
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h6 className="card-title">Product Orders</h6>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                className="form-input form-input-sm ps-9"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <LuSearch className="size-3.5 text-default-500" />
              </div>
            </div>

            <button
              onClick={exportToCSV}
              className="btn btn-sm bg-primary text-white"
            >
              <LuDownload className="size-3.5 me-1" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-default-200">
                  <thead className="bg-default-150">
                    <tr className="text-sm font-normal text-default-500 whitespace-nowrap">
                      <th className="px-3.5 py-3 text-start">#</th>
                      <th className="px-3.5 py-3 text-start">Order ID</th>
                      <th className="px-3.5 py-3 text-start">Customer</th>
                      <th className="px-3.5 py-3 text-start">Amount</th>
                      <th className="px-3.5 py-3 text-start">Payment</th>
                      <th className="px-3.5 py-3 text-start">Delivery</th>
                      <th className="px-3.5 py-3 text-start">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-default-200">
                    {currentOrders.map((order, idx) => (
                      <tr key={order._id || idx} className="text-default-800">
                        <td className="px-3.5 py-2.5 text-sm">
                          {(currentPage - 1) * ordersPerPage + idx + 1}
                        </td>
                        <td className="px-3.5 py-2.5 text-sm font-semibold text-blue-600">
                          {order.orderId}
                        </td>
                        <td className="px-3.5 py-2.5 text-sm">
                          {order.customerName}
                        </td>
                        <td className="px-3.5 py-2.5 text-sm font-medium">
                          ₹{order.amount}
                        </td>
                        <td className="px-3.5 py-2.5 text-sm">
                          <span className="text-green-600 font-medium">
                            {order.paymentStatus}
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span
                            className={`inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded text-xs font-medium ${statusClasses[order.deliveryStatus]}`}
                          >
                            {order.deliveryStatus}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 relative">
                          <button
                            className="btn size-7.5 bg-default-150 hover:bg-default-600 text-default-500 hover:text-white"
                            onClick={() =>
                              setMenuOpen(menuOpen === order._id ? null : order._id)
                            }
                          >
                            <LuEllipsis size={16} />
                          </button>

                          {menuOpen === order._id && (
                            <div className="absolute right-0 z-10 bg-white border rounded shadow-md mt-1 w-32">
                              <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">
                                <LuEye size={14} /> View
                              </button>
                              <button
                                className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                                onClick={() => {
                                  setEditOrder(order);
                                  setMenuOpen(null);
                                }}
                              >
                                <LuSquarePen size={14} /> Edit
                              </button>
                              <button
                                className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 text-red-600"
                                onClick={() => deleteOrder(order._id)}
                              >
                                <LuTrash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <p className="text-center py-4 text-sm text-gray-500">
                    No orders found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="card-footer">
          <p className="text-default-500 text-sm">
            Showing <b>{currentOrders.length}</b> of{" "}
            <b>{filteredOrders.length}</b> Results
          </p>
          <nav className="flex items-center gap-2" aria-label="Pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
            >
              <LuChevronLeft className="size-4 me-1" /> Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn size-7.5 ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "bg-transparent border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary"
            >
              Next <LuChevronRight className="size-4 ms-1" />
            </button>
          </nav>
        </div>
      </div>

      {editOrder && (
        <OrderEditModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onSuccess={() => fetchOrders()}
        />
      )}
    </div>
  );
};

export default ProductOrders;
