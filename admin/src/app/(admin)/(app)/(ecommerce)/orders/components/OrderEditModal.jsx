import { useState } from "react";
import axios from "axios";

const OrderEditModal = ({ order, onClose, onSuccess }) => {
  const [status, setStatus] = useState(order.deliveryStatus);

const updateStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/orders/${order._id}`,
      { deliveryStatus: status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    onSuccess();
    onClose();
  } catch (error) {
    console.log("Update error", error);
    alert("Failed to update!");
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-5 rounded w-96">
        <h2 className="text-lg font-semibold mb-3">Update Delivery Status</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="Pending">Pending</option>
          <option value="Shipping">Shipping</option>
          <option value="Delivered">Delivered</option>
          <option value="Return">Return</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-3 py-1 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={updateStatus}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditModal;
