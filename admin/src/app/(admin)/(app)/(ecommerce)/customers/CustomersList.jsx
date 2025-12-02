import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  MdSearch,
  MdRemoveRedEye,
  MdDelete,
  MdGroups,
  MdAutorenew,
  MdErrorOutline,
  MdClose,
  MdEmail,
  MdCalendarToday,
  MdShoppingCart,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdPending,
} from 'react-icons/md';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const formatCurrency = amount => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getTransactionStatusIcon = status => {
  if (!status) return <MdPending className="text-gray-400" title="N/A" />;
  switch (status.toLowerCase()) {
    case 'success':
      return <MdCheckCircle className="text-green-500" title="Success" />;
    case 'failed':
      return <MdCancel className="text-red-500" title="Failed" />;
    case 'pending':
      return <MdPending className="text-yellow-500" title="Pending" />;
    default:
      return <MdPending className="text-gray-400" title="N/A" />;
  }
};

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64 text-gray-500">
    <MdAutorenew className="animate-spin text-5xl text-blue-500" />
    <p className="mt-4 text-lg font-medium">Loading Customers...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-64 text-red-600">
    <MdErrorOutline className="text-6xl mb-4" />
    <h3 className="text-xl font-semibold">Error Fetching Data</h3>
    <p className="text-gray-700 mt-2">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <MdGroups className="text-6xl mb-4" />
    <h3 className="text-xl font-semibold">No Customers Found</h3>
    <p>The customer list is currently empty.</p>
  </div>
);

// Customer View Modal Component
const CustomerViewModal = ({ customer, onClose }) => {
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerOrders();
  }, [customer._id]);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/orders');
      const allOrders = response.data;
      const customerSpecificOrders = allOrders.filter(order => order.customer._id === customer._id);

      setCustomerOrders(customerSpecificOrders);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      setCustomerOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-card bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh]">
        {/* Header */}
        <div className="bg-card px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                <MdPerson className="text-lg text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
                <p className="text-sm text-gray-500">Customer Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="p-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <MdEmail className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <MdCalendarToday className="text-green-500 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <MdShoppingCart className="text-orange-500 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Orders</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {customer.totalOrders || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <MdShoppingCart className="mr-2 text-orange-500" />
                  Order History ({customerOrders.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <MdAutorenew className="animate-spin text-2xl text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading orders...</p>
                </div>
              ) : customerOrders.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                  {customerOrders.map(order => (
                    <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {order.productName || 'Product'}
                            </h4>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                order.paymentStatus === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : order.paymentStatus === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            Order ID: {order.orderId?.slice(-10) || order._id.slice(-8)}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                          {order.deliveryStatus && (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                                order.deliveryStatus === 'Delivered'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.deliveryStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.amount)}
                          </p>
                          {order.transaction && (
                            <div className="mt-1">
                              {getTransactionStatusIcon(order.transaction.status)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Order Details */}
                      {(order.customerName || order.contactNumber || order.address) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                            {order.customerName && (
                              <p>
                                <span className="font-medium">Name:</span> {order.customerName}
                              </p>
                            )}
                            {order.contactNumber && (
                              <p>
                                <span className="font-medium">Contact:</span> {order.contactNumber}
                              </p>
                            )}
                            {order.address && (
                              <p className="md:col-span-2">
                                <span className="font-medium">Address:</span> {order.address}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MdShoppingCart className="mx-auto text-3xl mb-2 text-gray-300" />
                  <p className="text-sm">No orders found</p>
                  <p className="text-xs text-gray-400">
                    This customer hasn't placed any orders yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerDetailTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCustomer, setViewCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.get('/customers');
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      setError(error.response?.data?.message || 'Failed to fetch customers.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = customer => {
    setViewCustomer(customer);
  };

  const handleDelete = customerId => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This customer will be permanently deleted. You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-lg shadow-lg',
      },
    }).then(result => {
      if (result.isConfirmed) {
        performDelete(customerId);
      }
    });
  };

  const performDelete = async id => {
    try {
      await adminApi.delete(`/customers/${id}`);
      Swal.fire({
        title: 'Deleted!',
        text: 'The customer has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-lg' },
      });
      fetchCustomers();
    } catch (err) {
      console.error('Delete failed:', err);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Delete failed. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
        customClass: { popup: 'rounded-lg' },
      });
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(
      customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customers]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (customers.length === 0) {
      return <EmptyState />;
    }
    if (filteredCustomers.length === 0) {
      return (
        <p className="p-8 text-center text-lg text-gray-500">No customers match your search.</p>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y bg-card">
          <thead className="bg-card">
            <tr className="text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card text-default-800 divide-y divide-gray-200">
            {filteredCustomers.map(customer => (
              <tr key={customer._id} className="hover:bg-card transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-blue-600">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-default-700">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-default-700">{customer.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-default-700 text-sm">{formatDate(customer.createdAt)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer.totalOrders || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    {/* <button
                      onClick={() => handleView(customer)}
                      className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                      title="View Details"
                    >
                      <MdRemoveRedEye size={16} />
                    </button> */}
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-100 transition-colors duration-200"
                      title="Delete Customer"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm  border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-default-800">Customer Management</h2>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-card"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MdSearch className="w-4 h-4 text-default-700" />
            </div>
          </div>
        </div>

        {renderContent()}

        {customers.length > 0 && !loading && (
          <div className="px-6 py-3 border-t border-gray-200 bg-card">
            <p className="text-sm text-default-700">
              Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
              <span className="font-medium">{customers.length}</span> customers
            </p>
          </div>
        )}
      </div>

      {viewCustomer && (
        <CustomerViewModal customer={viewCustomer} onClose={() => setViewCustomer(null)} />
      )}
    </>
  );
};

export default CustomerDetailTable;
