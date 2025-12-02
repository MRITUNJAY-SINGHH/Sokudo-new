import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuEye } from "react-icons/lu";

const DealershipList = () => {
  const [dealerships, setDealerships] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Fetch Dealership Data
  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dealership`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDealerships(res.data.dealerships || []);
      } catch (error) {
        console.error("❌ Error fetching dealerships:", error);
      }
    };

    fetchDealerships();
  }, []);

  // 🔹 Open & Close Modal
  const openModal = (dealer) => {
    setSelectedDealer(dealer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDealer(null);
  };

  return (
    <div className="grid grid-cols-1 gap-5 mb-5">
      <div className="card">
        {/* Header */}
        <div className="card-header flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Dealership Requests</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-default-200 text-sm">
            <thead className="bg-default-150 text-left">
              <tr>
                <th className="px-3.5 py-3">Name</th>
                <th className="px-3.5 py-3">Email</th>
                <th className="px-3.5 py-3">Contact</th>
                <th className="px-3.5 py-3">Qualification</th>
                <th className="px-3.5 py-3">Present Business</th>
                <th className="px-3.5 py-3">Message</th>
                <th className="px-3.5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default-200">
              {dealerships.length > 0 ? (
                dealerships.map((dealer) => (
                  <tr key={dealer._id} className="text-default-800">
                    <td className="px-3.5 py-2.5 font-medium">{dealer.name}</td>
                    <td className="px-3.5 py-2.5">{dealer.email}</td>
                    <td className="px-3.5 py-2.5">{dealer.contact}</td>
                    <td className="px-3.5 py-2.5">{dealer.qualification}</td>
                    <td className="px-3.5 py-2.5">{dealer.presentBusiness}</td>
                    <td className="px-3.5 py-2.5">
                      {dealer.comments?.length > 40
                        ? dealer.comments.slice(0, 40) + "..."
                        : dealer.comments || "-"}
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <button
                        onClick={() => openModal(dealer)}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-primary text-white rounded hover:bg-primary/80"
                      >
                        <LuEye className="size-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-gray-500">
                    No dealership requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal (Same Style as ContactList) */}
      {isModalOpen && selectedDealer && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Dealership Details
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {selectedDealer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedDealer.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedDealer.contact}
              </p>
              <p>
                <strong>Age:</strong> {selectedDealer.age}
              </p>
              <p>
                <strong>Qualification:</strong> {selectedDealer.qualification}
              </p>
              <p>
                <strong>Present Business:</strong>{" "}
                {selectedDealer.presentBusiness}
              </p>
              <p>
                <strong>Years:</strong> {selectedDealer.years}
              </p>
              <p>
                <strong>Turnover:</strong> {selectedDealer.turnover}
              </p>
              <p>
                <strong>Investment:</strong> {selectedDealer.investment}
              </p>
              <p>
                <strong>Address:</strong> {selectedDealer.address}
              </p>
              <p>
                <strong>Comments:</strong> {selectedDealer.comments}
              </p>
            </div>
            <button
              className="mt-5 btn w-full bg-primary text-white"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealershipList;
