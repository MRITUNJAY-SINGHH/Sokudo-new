import { useEffect, useState } from "react";
import axios from "axios";
import { LuSearch, LuArrowUp, LuArrowDown } from "react-icons/lu";
import toast from "react-hot-toast";

const InventoryTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  // ✅ Fetch inventory
  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/inventory`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update stock directly
  const updateStock = async (productId, change) => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/inventory/update`,
        { productId, quantityChange: change },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Stock updated successfully!");
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? data.product : p))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stock!");
    }
  };

  if (loading) return <p className="p-5 text-center">Loading inventory...</p>;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Inventory Management</h2>
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            className="pl-9 pr-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2 border-b w-2/4">Product Name</th>
              <th className="text-center px-4 py-2 border-b w-1/4">Current Stock</th>
              <th className="text-center px-4 py-2 border-b w-1/4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-3 text-gray-500 border-t"
                >
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{product.name}</td>
                  <td className="text-center px-4 py-2 border-b font-semibold text-blue-700">
                    {product.stock}
                  </td>
                  <td className="text-center px-4 py-2 border-b">
                    <div className="flex justify-center gap-3">
                      <button
                        className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs transition"
                        onClick={() => updateStock(product._id, +1)}
                      >
                        <LuArrowUp size={14} /> Add
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs transition"
                        onClick={() => {
                          if (product.stock === 0)
                            return toast.error("Stock already zero!");
                          updateStock(product._id, -1);
                        }}
                      >
                        <LuArrowDown size={14} /> Reduce
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
