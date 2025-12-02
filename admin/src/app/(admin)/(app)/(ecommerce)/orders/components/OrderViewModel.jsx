import React from "react";
import { LuX } from "react-icons/lu";

const OrderViewModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Order Details — <span className="text-primary">{order.orderId}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <LuX size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm text-gray-700">
          {/* Customer Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Customer Information</h3>
            <p><strong>Name:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}</p>
            {order.landmark && <p><strong>Landmark:</strong> {order.landmark}</p>}
          </div>

          {/* Product Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Product Details</h3>
            <p><strong>Model:</strong> {order.model}</p>
            <p><strong>Color:</strong> {order.color}</p>
            <p><strong>Amount:</strong> ₹{order.amount}</p>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Payment Details</h3>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> <span className="text-green-600 font-medium">{order.paymentStatus}</span></p>
          </div>

          {/* Delivery Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Delivery Details</h3>
            <p><strong>Status:</strong> {order.deliveryStatus}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
