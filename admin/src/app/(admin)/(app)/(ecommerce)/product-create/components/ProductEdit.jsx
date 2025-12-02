// ------------------------------------------------------------
// EDIT PRODUCT (Supports Color-wise Images Exactly Like Create)
// ------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LuCloudUpload } from "react-icons/lu";
import { FaPlus, FaXmark } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

// ------------------ UPDATED SCHEMA (Added 4 new fields) ------------------
const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  stock: yup
    .string()
    .matches(/^[0-9]+$/)
    .typeError("Stock must be a number")
    .required("Stock is required"),

  netExShowroomPrice: yup
    .number()
    .typeError("Price must be a number")
    .positive("Must be greater than 0")
    .required("Ex-showroom price is required"),

  rto: yup.number().typeError("RTO must be a number").required("RTO is required"),
  handlingCharge: yup
    .number()
    .typeError("Handling Charge must be a number")
    .required("Handling charge is required"),
  Insurance: yup
    .number()
    .typeError("Insurance must be a number")
    .required("Insurance is required"),
  onRoadePrice: yup
    .number()
    .typeError("On-road price must be a number")
    .required("On-Road Price is required"),

  description: yup
    .string()
    .min(10, "Description should be at least 10 characters")
    .required("Description is required"),
});

const tabs = [
  { id: "engineAndTransmission", label: "Engine and Transmission" },
  { id: "dimensionsAndCapacity", label: "Dimensions and Capacity" },
  { id: "electricals", label: "Electricals" },
  { id: "tyresAndBrakes", label: "Tyres and Brakes" },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("engineAndTransmission");
  const [loading, setLoading] = useState(false);

  // ************** COLOR STATE **************
  const [colors, setColors] = useState([]);

  // ************** SECTIONS **************
  const [sections, setSections] = useState({
    engineAndTransmission: [{ key: "", value: "" }],
    dimensionsAndCapacity: [{ key: "", value: "" }],
    electricals: [{ key: "", value: "" }],
    tyresAndBrakes: [{ key: "", value: "" }],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  // -----------------------------------------------------------
  // LOAD PRODUCT
  // -----------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const p = res.data.product;

        reset({
          name: p.name,
          stock: p.stock,
          netExShowroomPrice: p.netExShowroomPrice,
          rto: p.rto,
          handlingCharge: p.handlingCharge,
          Insurance: p.Insurance,
          onRoadePrice: p.onRoadePrice,
          description: p.description,
        });

        setSections(p.sections);

        setColors(
          p.colors.map((c) => ({
            name: c.name,
            images: [],
            existingImages: c.images,
          }))
        );
      } catch (error) {
        toast.error("Failed to load product");
      }
    })();
  }, [id, reset]);

  // -----------------------------------------------------------
  // SECTION HANDLERS
  // -----------------------------------------------------------
  const handleAddRow = (tabId) => {
    setSections((prev) => ({
      ...prev,
      [tabId]: [...prev[tabId], { key: "", value: "" }],
    }));
  };

  const handleRemoveRow = (tabId, index) => {
    setSections((prev) => ({
      ...prev,
      [tabId]: prev[tabId].filter((_, i) => i !== index),
    }));
  };

  const handleChangeRow = (tabId, index, field, value) => {
    setSections((prev) => {
      const updated = [...prev[tabId]];
      updated[index][field] = value;
      return { ...prev, [tabId]: updated };
    });
  };

  // -----------------------------------------------------------
  // COLOR HANDLERS
  // -----------------------------------------------------------
  const addColor = () => {
    setColors((prev) => [...prev, { name: "", images: [], existingImages: [] }]);
  };

  const removeColor = (index) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorNameChange = (index, value) => {
    setColors((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const handleColorImageChange = (index, fileList) => {
    if (!fileList) return;

    const files = Array.from(fileList);

    setColors((prev) => {
      const updated = [...prev];
      updated[index].images.push(...files);
      return updated;
    });
  };

  const removeExistingImage = (colorIndex, url) => {
    setColors((prev) => {
      const updated = [...prev];
      updated[colorIndex].existingImages = updated[colorIndex].existingImages.filter(
        (img) => img !== url
      );
      return updated;
    });
  };

  const removeNewImage = (colorIndex, idx) => {
    setColors((prev) => {
      const updated = [...prev];
      updated[colorIndex].images = updated[colorIndex].images.filter((_, i) => i !== idx);
      return updated;
    });
  };

  const validateSections = () => {
    for (const [tab, rows] of Object.entries(sections)) {
      for (let i = 0; i < rows.length; i++) {
        if (!rows[i].key.trim() || !rows[i].value.trim()) {
          toast.error(`Please fill both fields in "${tab}" row ${i + 1}`);
          return false;
        }
      }
    }
    return true;
  };

  const hasAtLeastOneImage = () =>
    colors.some((c) => c.images.length > 0 || c.existingImages.length > 0);

  // -----------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------
  const onSubmit = async (data) => {
    if (!hasAtLeastOneImage()) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!validateSections()) return;

    const form = new FormData();

    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    form.append("sections", JSON.stringify(sections));

    const colorPayload = colors.map((c, idx) => ({
      name: c.name || `Color ${idx + 1}`,
      index: idx,
      existingImages: c.existingImages,
    }));

    form.append("colors", JSON.stringify(colorPayload));

    colors.forEach((c, idx) => {
      c.images.forEach((file) => {
        form.append(`colorImages_${idx}`, file);
      });
    });

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product updated successfully");
      navigate("/product-list");
    } catch (e) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  // RENDER UI
  // -----------------------------------------------------------
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic fields */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label>Product Name</label>
            <input className="form-input" {...register("name")} />
          </div>

          <div>
            <label>Stock</label>
            <input className="form-input" {...register("stock")} />
          </div>
        </div>

        {/* Price fields */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label>Ex-Showroom Price</label>
            <input type="number" className="form-input" {...register("netExShowroomPrice")} />
            {errors.netExShowroomPrice && <p className="text-red-500 text-sm">{errors.netExShowroomPrice.message}</p>}
          </div>

          <div>
            <label>RTO</label>
            <input type="number" className="form-input" {...register("rto")} />
            {errors.rto && <p className="text-red-500 text-sm">{errors.rto.message}</p>}
          </div>

          <div>
            <label>Handling Charge</label>
            <input type="number" className="form-input" {...register("handlingCharge")} />
            {errors.handlingCharge && <p className="text-red-500 text-sm">{errors.handlingCharge.message}</p>}
          </div>

          <div>
            <label>Insurance</label>
            <input type="number" className="form-input" {...register("Insurance")} />
            {errors.Insurance && <p className="text-red-500 text-sm">{errors.Insurance.message}</p>}
          </div>

          <div>
            <label>On-Road Price</label>
            <input type="number" className="form-input" {...register("onRoadePrice")} />
            {errors.onRoadePrice && <p className="text-red-500 text-sm">{errors.onRoadePrice.message}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label>Description</label>
          <textarea rows={4} className="form-input" {...register("description")} />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b mb-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 border-b-2 ${
                  activeTab === t.id ? "border-primary text-primary" : "border-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded border">
            {sections[activeTab]?.map((row, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  className="form-input"
                  value={row.key}
                  placeholder="Key"
                  onChange={(e) => handleChangeRow(activeTab, i, "key", e.target.value)}
                />
                <input
                  className="form-input"
                  value={row.value}
                  placeholder="Value"
                  onChange={(e) => handleChangeRow(activeTab, i, "value", e.target.value)}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => handleRemoveRow(activeTab, i)}
                >
                  <FaXmark />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="bg-primary text-white px-3 py-1 rounded flex items-center gap-2"
              onClick={() => handleAddRow(activeTab)}
            >
              <FaPlus /> Add Row
            </button>
          </div>
        </div>

        {/* COLOR WISE IMAGES */}
        <h3 className="font-semibold mb-3">Product Colours & Images</h3>

        {colors.map((color, index) => (
          <div key={index} className="border p-4 rounded mb-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="text"
                placeholder="Color Name"
                className="form-input"
                value={color.name}
                onChange={(e) => handleColorNameChange(index, e.target.value)}
              />

              {colors.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-2 rounded"
                  onClick={() => removeColor(index)}
                >
                  <FaXmark />
                </button>
              )}
            </div>

            {/* Upload box */}
            <label
              htmlFor={`upload-${index}`}
              className="cursor-pointer border-dashed border p-6 rounded flex flex-col items-center"
            >
              <LuCloudUpload className="text-4xl mb-2" />
              <p>Upload Images for {color.name || `Color ${index + 1}`}</p>
              <input
                id={`upload-${index}`}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleColorImageChange(index, e.target.files)}
              />
            </label>

            {/* Existing images */}
            <div className="flex gap-4 flex-wrap mt-4">
              {color.existingImages?.map((img, i) => (
                <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index, img)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 text-xs rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* New images */}
            <div className="flex gap-4 flex-wrap mt-4">
              {color.images?.map((file, i) => (
                <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index, i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 text-xs rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="bg-primary text-white px-3 py-2 rounded flex items-center gap-2"
          onClick={addColor}
        >
          <FaPlus /> Add Another Color
        </button>

        <div className="mt-6">
          <button
            disabled={loading}
            className={`btn bg-primary text-white ${loading ? "opacity-70" : ""}`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
