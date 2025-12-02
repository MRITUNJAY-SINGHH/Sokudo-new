import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete, MdSearch } from "react-icons/md";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coupons`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(coupons.filter((c) => c._id !== id));
      alert("Coupon deleted successfully!");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Failed to delete coupon.");
    }
  };

 const filteredCoupons = coupons.filter((coupon) =>
  (coupon.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
  (coupon.code?.toLowerCase() || "").includes(searchTerm.toLowerCase())
);


  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  if (loading) return <p>Loading coupons...</p>;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-gray-200">
      {/* Header + Search */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-default-700">Coupons List</h2>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-gray-300 bg-card focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MdSearch className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-card">
            <tr className="text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Discount (%)</th>
              <th className="px-6 py-3">Expiry</th>
              <th className="px-6 py-3">Usage Limit</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-gray-200">
            {filteredCoupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-default-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{coupon.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.discount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(coupon.expiry)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.limit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-100 transition-colors duration-200"
                    title="Delete Coupon"
                  >
                    <MdDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coupons.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-card">
          <p className="text-sm text-default-600">
            Showing <span className="font-medium">{filteredCoupons.length}</span> of{" "}
            <span className="font-medium">{coupons.length}</span> coupons
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponList;
