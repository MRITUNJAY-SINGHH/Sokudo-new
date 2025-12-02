import { useEffect, useState } from "react";
import axios from "axios";
import {
  LuSearch,
  LuEllipsis,
  LuEye,
  LuSquarePen,
  LuTrash2,
} from "react-icons/lu";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import OrderEditModal from "./OrderEditModal";
import OrderViewModal from "./OrderViewModel";
import toast from "react-hot-toast";

const statusClasses = {
  Delivered: "bg-green-100 text-green-600 border border-green-300",
  Pending: "bg-yellow-100 text-yellow-600 border border-yellow-300",
  Shipping: "bg-blue-100 text-blue-600 border border-blue-300",
  Return: "bg-gray-200 text-gray-700 border border-gray-300",
  Cancelled: "bg-red-100 text-red-600 border border-red-300",
};

const OrderDetailTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Fetch Orders
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
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error("Failed to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SweetAlert Delete Confirmation
  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-lg shadow-lg",
        confirmButton: "px-4 py-2 rounded-md font-medium",
        cancelButton: "px-4 py-2 rounded-md font-medium",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        title: "Deleted!",
        text: "The order has been deleted successfully.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        customClass: { popup: "rounded-lg" },
      });

      fetchOrders();
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          "Failed to delete order. Please try again.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
        customClass: { popup: "rounded-lg" },
      });
    }
  };

  if (loading) return <p className="p-5 text-center">Loading orders...</p>;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center gap-2">
        <div className="relative">
          <input
            type="text"
            className="form-input form-input-sm ps-9"
            placeholder="Search orders..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LuSearch className="size-3.5" />
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-3 text-blue-600">{order.orderId}</td>

                <td className="py-2 px-3 flex items-center gap-2">
                  <div>
                    <p>{order.productName}</p>
                  </div>
                </td>

                <td className="py-2 px-3">{order.customerName}</td>

                <td className="py-2 px-3 font-semibold">₹{order.amount}</td>

                <td className="py-2 px-3">
                  <span className="text-green-600 font-medium">
                    {order.paymentStatus}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    {order.paymentMethod}
                  </span>
                </td>

                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      statusClasses[order.deliveryStatus]
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>
                </td>

                <td className="relative">
                  <button
                    className="btn btn-xs bg-gray-200"
                    onClick={() =>
                      setMenuOpen(menuOpen === order._id ? null : order._id)
                    }
                  >
                    <LuEllipsis size={14} />
                  </button>

                  {menuOpen === order._id && (
                    <div className="absolute right-0 z-10 bg-white shadow-lg rounded border p-2 flex flex-col text-sm">
                      <button
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1"
                        onClick={() => {
                          setViewOrder(order);
                          setMenuOpen(null);
                        }}
                      >
                        <LuEye size={14} /> View
                      </button>

                      <button
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1"
                        onClick={() => {
                          setEditOrder(order);
                          setMenuOpen(null);
                        }}
                      >
                        <LuSquarePen size={14} /> Edit
                      </button>

                      <button
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 text-red-600"
                        onClick={() => {
                          setMenuOpen(null);
                          deleteOrder(order._id);
                        }}
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
      </div>

      {editOrder && (
        <OrderEditModal
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onSuccess={() => fetchOrders()}
        />
      )}

      {viewOrder && (
        <OrderViewModal order={viewOrder} onClose={() => setViewOrder(null)} />
      )}
    </div>
  );
};

export default OrderDetailTable;
