import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LuPlus,
  LuEllipsis,
  LuSquarePen,
  LuTrash2,
  LuEye,
} from "react-icons/lu";

const colorMap = {
  Red: "#ff3b30",
  Blue: "#007aff",
  Black: "#1c1c1e",
  White: "#ffffff",
  Green: "#34c759",
  Yellow: "#ffcc00",
  Gray: "#8e8e93",
};

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = () => navigate("/product-create");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data.products);
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Open modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Helper: get first image
  const getFirstImage = (p) => {
    return (
      p.colors?.[0]?.images?.[0] ||
      p.images?.[0] ||
      "/placeholder.png"
    );
  };

  return (
    <>
      {/* PRODUCT TABLE */}
      <div className="grid grid-cols-1 gap-5 mb-5">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Products</h2>
            <button
              className="btn btn-sm bg-primary text-white flex items-center gap-1"
              onClick={handleAddProduct}
            >
              <LuPlus className="size-4" /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-default-200 text-sm">
              <thead className="bg-default-150 text-left">
                <tr>
                  <th className="px-3.5 py-3">Image</th>
                  <th className="px-3.5 py-3">Name</th>
                  <th className="px-3.5 py-3">Stock</th>
                  <th className="px-3.5 py-3">Ex-Showroom</th>
                  <th className="px-3.5 py-3">Colors</th>
                  <th className="px-3.5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-default-200">
                {products.length ? (
                  products.map((product) => (
                    <tr key={product._id} className="text-default-800">
                      <td className="px-3.5 py-2.5">
                        <img
                          src={getFirstImage(product)}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </td>

                      <td className="px-3.5 py-2.5 font-medium">
                        {product.name}
                      </td>

                      <td className="px-3.5 py-2.5">{product.stock}</td>

                      <td className="px-3.5 py-2.5">
                        ₹{product.netExShowroomPrice}
                      </td>

                      {/* Colors */}
                      <td className="px-3.5 py-2.5">
                        <div className="flex gap-2">
                          {product.colors?.map((col, i) => (
                            <div key={i} className="relative group">
                              <div
                                className="w-6 h-6 rounded-full border ring-1 ring-black/10"
                                style={{
                                  background: colorMap[col.name] || "#d1d1d1",
                                }}
                              ></div>

                              {col.images?.length > 0 && (
                                <div className="absolute hidden group-hover:block z-50 bg-white p-2 shadow-xl rounded top-7 left-0 w-24">
                                  <img
                                    src={col.images[0]}
                                    className="w-full h-16 object-cover rounded"
                                  />
                                  <p className="text-xs text-center mt-1">
                                    {col.images.length} images
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3.5 py-2.5">
  <div className="hs-dropdown relative inline-flex">
    <button
      type="button"
      className="hs-dropdown-toggle btn size-7.5 bg-default-200 hover:bg-default-600 text-default-500 hover:text-white"
    >
      <LuEllipsis className="size-4" />
    </button>

    <div className="hs-dropdown-menu" role="menu">
      
      {/* VIEW (Open Modal) */}
      <button
        onClick={() => openModal(product)}
        className="flex items-center gap-1.5 py-1.5 px-3 font-medium hover:bg-default-150 rounded"
      >
        <LuEye className="size-3" /> View
      </button>

      {/* EDIT (Correct Navigation) */}
      <button
        onClick={() => navigate(`/product-edit/${product._id}`)}
        className="flex items-center gap-1.5 py-1.5 px-3 font-medium hover:bg-default-150 rounded"
      >
        <LuSquarePen className="size-3" /> Edit
      </button>

      {/* DELETE */}
      {/* <button
        className="flex items-center gap-1.5 py-1.5 px-3 font-medium text-red-500 hover:bg-default-150 rounded"
      >
        <LuTrash2 className="size-3" /> Delete
      </button> */}
    </div>
  </div>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-gray-500">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PRODUCT VIEW MODAL */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-3xl relative shadow-xl overflow-y-auto max-h-[90vh]">

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-700 hover:text-black"
            >
              ✕
            </button>
            <button
  onClick={() => navigate(`/product-edit/${selectedProduct._id}`)}
  className="absolute top-3 right-12 text-blue-600 font-medium hover:underline"
>
  Edit
</button>


            {/* Header */}
            <h2 className="text-xl font-bold mb-3">
              {selectedProduct.name}
            </h2>

            {/* Main Image */}
            <img
              src={getFirstImage(selectedProduct)}
              className="w-full h-60 object-contain rounded mb-4 bg-gray-50"
            />

            {/* Prices */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <p><b>Ex-Showroom:</b> ₹{selectedProduct.netExShowroomPrice}</p>
              <p><b>RTO:</b> ₹{selectedProduct.rto}</p>
              <p><b>Handling:</b> ₹{selectedProduct.handlingCharge}</p>
              <p><b>Insurance:</b> ₹{selectedProduct.Insurance}</p>
              <p className="col-span-2 text-green-600 font-semibold">
                <b>On-Road Price:</b> ₹{selectedProduct.onRoadePrice}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm mb-4">
              {selectedProduct.description}
            </p>

            {/* Colors + images */}
            <h3 className="font-semibold mb-2">Color Variants</h3>

            <div className="grid grid-cols-3 gap-3">
              {selectedProduct.colors?.map((col, i) => (
                <div key={i} className="border rounded p-2">
                  <div
                    className="w-6 h-6 rounded-full mb-2"
                    style={{ background: colorMap[col.name] || "#d1d1d1" }}
                  ></div>
                  {col.images?.map((img, k) => (
                    <img
                      key={k}
                      src={img}
                      className="w-full h-20 object-cover rounded mb-1"
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Dynamic Sections */}
            <h3 className="font-semibold mt-4 mb-2">Specifications</h3>
            {Object.entries(selectedProduct.sections || {}).map(
              ([key, items], i) => (
                <div key={i} className="mb-3">
                  <h4 className="font-semibold text-sm capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h4>
                  <ul className="text-sm ml-4 list-disc">
                    {items.map((it, idx) => (
                      <li key={idx}>
                        <b>{it.key}:</b> {it.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
