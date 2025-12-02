import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuEllipsis, LuEye } from "react-icons/lu";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch all contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data.contacts || []);
      } catch (err) {
        console.error("❌ Error fetching contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  // ✅ Open modal
  const openModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setSelectedContact(null);
    setIsModalOpen(false);
  };

  // ✅ Helper: Trim long message
  const trimMessage = (msg) => {
    if (!msg) return "";
    return msg.length > 50 ? msg.substring(0, 50) + "..." : msg;
  };

  return (
    <div className="grid grid-cols-1 gap-5 mb-5">
      <div className="card">
        {/* Header */}
        <div className="card-header flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Contact Messages</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-default-200 text-sm">
            <thead className="bg-default-150 text-left">
              <tr>
                <th className="px-3.5 py-3">Name</th>
                <th className="px-3.5 py-3">Email</th>
                <th className="px-3.5 py-3">Phone</th>
                <th className="px-3.5 py-3">Message</th>
                <th className="px-3.5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default-200">
              {contacts.length > 0 ? (
                contacts.map((c) => (
                  <tr key={c._id} className="text-default-800">
                    <td className="px-3.5 py-2.5 font-medium">{c.name}</td>
                    <td className="px-3.5 py-2.5">{c.email}</td>
                    <td className="px-3.5 py-2.5">{c.phone}</td>
                    <td className="px-3.5 py-2.5">{trimMessage(c.message)}</td>

                    <td className="px-3.5 py-2.5">
                      
                        
                        
                          <button
                            onClick={() => openModal(c)}
                        className="flex items-center gap-1.5 py-1.5 px-3 bg-primary text-white rounded hover:bg-primary/80"
                          >
                            <LuEye className="size-3" /> View
                          </button>
                        
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal */}
      {isModalOpen && selectedContact && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Contact Details
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {selectedContact.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedContact.phone}
              </p>
              <p>
                <strong>Message:</strong>
                <br />
                {selectedContact.message}
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

export default ContactList;
