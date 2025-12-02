import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuEye } from "react-icons/lu";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/leads`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLeads(res.data.data || []);
      } catch (error) {
        console.error("❌ Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  const openModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="grid grid-cols-1 gap-5 mb-5">
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Leads</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-default-200 text-sm">
            <thead className="bg-default-150 text-left">
              <tr>
                <th className="px-3.5 py-3">Name</th>
                <th className="px-3.5 py-3">Phone</th>
                <th className="px-3.5 py-3">Pincode</th>
                <th className="px-3.5 py-3">Product</th>
                <th className="px-3.5 py-3">Date</th>
                <th className="px-3.5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default-200">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="text-default-800">
                    <td className="px-3.5 py-2.5 font-medium">{lead.name}</td>
                    <td className="px-3.5 py-2.5">{lead.phone}</td>
                    <td className="px-3.5 py-2.5">{lead.pincode}</td>
                    <td className="px-3.5 py-2.5">{lead.productInterested}</td>
                    <td className="px-3.5 py-2.5">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-3.5 py-2.5 text-center">
                      <button
                        onClick={() => openModal(lead)}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-primary text-white rounded hover:bg-primary/80"
                      >
                        <LuEye className="size-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-gray-500">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Lead Details
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {selectedLead.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedLead.phone}
              </p>
              <p>
                <strong>Pincode:</strong> {selectedLead.pincode}
              </p>
              <p>
                <strong>Product Interested:</strong>{" "}
                {selectedLead.productInterested}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedLead.createdAt).toLocaleString()}
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

export default LeadList;
