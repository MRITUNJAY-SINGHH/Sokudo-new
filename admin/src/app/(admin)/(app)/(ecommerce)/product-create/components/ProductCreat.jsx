import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LuCloudUpload } from 'react-icons/lu';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import axios from 'axios';
import toast from 'react-hot-toast';

// Yup Schema (updated with 4 new numeric fields)
const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  stock: yup
    .string()
    .matches(/^[0-9]+$/)
    .typeError('Stock must be a number')
    .required('Stock is required'),
  netExShowroomPrice: yup
    .number()
    .typeError('Price must be a number')
    .positive('Must be greater than 0')
    .required('Ex-showroom price is required'),
  rto: yup
    .number()
    .typeError('RTO must be a number')
    .min(0, 'Must be 0 or greater')
    .required('RTO is required'),
  handlingCharge: yup
    .number()
    .typeError('Handling charge must be a number')
    .min(0, 'Must be 0 or greater')
    .required('Handling charge is required'),
  Insurance: yup
    .number()
    .typeError('Insurance must be a number')
    .min(0, 'Must be 0 or greater')
    .required('Insurance is required'),
  onRoadePrice: yup
    .number()
    .typeError('On-road price must be a number')
    .min(0, 'Must be 0 or greater')
    .required('On-road price is required'),
  description: yup
    .string()
    .min(10, 'Description should be at least 10 characters')
    .required('Description is required'),
});

const tabs = [
  { id: 'engineAndTransmission', label: 'Engine and Transmission' },
  { id: 'dimensionsAndCapacity', label: 'Dimensions and Capacity' },
  { id: 'electricals', label: 'Electricals' },
  { id: 'tyresAndBrakes', label: 'Tyres and Brakes' },
];

const ProductCreat = ({ formData, setFormData, files, setFiles, sections, setSections, colors, setColors }) => {

  const [activeTab, setActiveTab] = useState('engineAndTransmission');
  const [loading, setLoading] = useState(false);

  // COLOR STATE: each color has { name: string, images: File[] }
  // const [colors, setColors] = useState([{ name: '', images: [] }]); // start with one empty color

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  // keep syncing simple fields with parent formData (same as before)
  useEffect(() => {
    const subscription = watch(value => setFormData(value));
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  // ------------ Sections handlers (same as before) ------------
  const handleAddRow = tabId => {
    setSections(prev => ({
      ...prev,
      [tabId]: [...prev[tabId], { key: '', value: '' }],
    }));
  };

  const handleRemoveRow = (tabId, index) => {
    setSections(prev => ({
      ...prev,
      [tabId]: prev[tabId].filter((_, i) => i !== index),
    }));
  };

  const handleChangeRow = (tabId, index, field, value) => {
    setSections(prev => {
      const updated = [...prev[tabId]];
      updated[index][field] = value;
      return { ...prev, [tabId]: updated };
    });
  };

  const validateSections = () => {
    for (const [tab, rows] of Object.entries(sections)) {
      for (let i = 0; i < rows.length; i++) {
        const { key, value } = rows[i];
        if (!key.trim() || !value.trim()) {
          toast.error(
            `Please fill both Key and Value in "${tabs.find(t => t.id === tab)?.label}" (Row ${i + 1})`
          );
          return false;
        }
      }
    }
    return true;
  };

  // ------------ Color handlers ------------
  const addColor = () => {
    setColors(prev => [...prev, { name: '', images: [] }]);
  };

  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorNameChange = (index, value) => {
    setColors(prev => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const handleColorImageChange = (index, fileList) => {
    if (!fileList) return;

    const selected = Array.from(fileList);

    // Remove duplicates using name+size signature
    const makeKey = (file) => `${file.name}-${file.size}`;

    setColors(prev => {
      const updated = [...prev];
      const existing = updated[index].images;

      // Existing unique keys
      const existingKeys = new Set(existing.map(makeKey));

      // Only push new files that do NOT already exist
      const filtered = selected.filter(file => {
        const key = makeKey(file);
        if (existingKeys.has(key)) return false; // skip duplicate
        existingKeys.add(key);
        return true;
      });

      updated[index].images = [...existing, ...filtered];
      return updated;
    });
  };

  const removeColorImage = (colorIndex, imageIndex) => {
    setColors(prev => {
      const updated = [...prev];
      updated[colorIndex].images = updated[colorIndex].images.filter((_, i) => i !== imageIndex);
      return updated;
    });
  };

  // ------------ Reset helper (extended) ------------
  const resetAll = () => {
    reset(); // reset form fields
    setFiles([]); // keep this for backward compatibility (if parent expects it)
    setSections({
      engineAndTransmission: [{ key: '', value: '' }],
      dimensionsAndCapacity: [{ key: '', value: '' }],
      electricals: [{ key: '', value: '' }],
      tyresAndBrakes: [{ key: '', value: '' }],
    });
    setColors([{ name: '', images: [] }]);
    toast.success('Form reset successfully');
  };

  // Helper: check at least one image exists across colors
  const hasAtLeastOneImage = () => {
    return colors.some(c => c.images && c.images.length > 0);
  };

  // ------------ Submit ------------
  const onSubmit = async data => {
    if (!hasAtLeastOneImage()) {
      toast.error('Please upload at least one image (add to any color)');
      return;
    }

    if (!validateSections()) {
      return; // stop if validation fails
    }

    setLoading(true);

    try {
      const form = new FormData();

      // append simple fields
      Object.entries(data).forEach(([key, value]) => {
        // ensure we append only primitive values (react-hook-form returns strings/numbers)
        form.append(key, value);
      });

      // append sections
      form.append('sections', JSON.stringify(sections));

      // build colors array for backend: [{name, index}, ...]
      const colorsPayload = colors.map((c, idx) => ({ name: c.name || `Color ${idx+1}`, index: idx }));
      form.append('colors', JSON.stringify(colorsPayload));

      // append files per color with keys colorImages_{index}
      colors.forEach((c, idx) => {
        if (c.images && c.images.length > 0) {
          c.images.forEach(file => {
            form.append(`colorImages_${idx}`, file);
          });
        }
      });

      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product created successfully!');
      console.log(res.data);

      resetAll();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // ------------ Render ------------
  return (
    <div className="lg:col-span-9 col-span-1">
      <div className="card">
        <div className="card-body">
          <h6 className="mb-4 card-title">Create Product</h6>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Product Name and Stock */}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
              <div>
                <label className="inline-block mb-2 text-sm font-medium">Product Name</label>
                <input
                  {...register('name')}
                  type="text"
                  className="form-input"
                  placeholder="Product Name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="inline-block mb-2 text-sm font-medium">Stock</label>
                <input
                  {...register('stock')}
                  type="string"
                  className="form-input"
                  placeholder="Stock Quantity"
                />
                {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
              </div>
            </div>

            {/* Price */}
            <div className="mb-5">
              <label className="inline-block mb-2 text-sm font-medium">Ex-Showroom Price</label>
              <input
                {...register('netExShowroomPrice')}
                type="number"
                className="form-input"
                placeholder="Enter Price"
              />
              {errors.netExShowroomPrice && (
                <p className="text-red-500 text-sm">{errors.netExShowroomPrice.message}</p>
              )}
            </div>

            {/* NEW: RTO / Handling / Insurance / On-road (same style as price) */}
            <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="inline-block mb-2 text-sm font-medium">RTO</label>
                <input
                  {...register('rto')}
                  type="number"
                  className="form-input"
                  placeholder="Enter RTO amount"
                />
                {errors.rto && <p className="text-red-500 text-sm">{errors.rto.message}</p>}
              </div>

              <div>
                <label className="inline-block mb-2 text-sm font-medium">Handling Charge</label>
                <input
                  {...register('handlingCharge')}
                  type="number"
                  className="form-input"
                  placeholder="Enter handling charge"
                />
                {errors.handlingCharge && <p className="text-red-500 text-sm">{errors.handlingCharge.message}</p>}
              </div>

              <div>
                <label className="inline-block mb-2 text-sm font-medium">Insurance</label>
                <input
                  {...register('Insurance')}
                  type="number"
                  className="form-input"
                  placeholder="Enter insurance amount"
                />
                {errors.Insurance && <p className="text-red-500 text-sm">{errors.Insurance.message}</p>}
              </div>

              <div>
                <label className="inline-block mb-2 text-sm font-medium">On-Road Price</label>
                <input
                  {...register('onRoadePrice')}
                  type="number"
                  className="form-input"
                  placeholder="Enter on-road price"
                />
                {errors.onRoadePrice && <p className="text-red-500 text-sm">{errors.onRoadePrice.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 mb-5">
              <label className="inline-block mb-2 text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                className="form-input"
                placeholder="Enter Description"
                rows={5}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* Tabs for sections */}
            <div className="mb-6">
              <div className="flex flex-wrap border-b-gray-500 mb-4">
                {tabs.map(tab => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-gray-500 text-primary'
                        : 'border-transparent text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-gray-600 rounded-md ">
                {sections[activeTab].map((row, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Key"
                      className="form-input flex-1"
                      value={row.key}
                      onChange={e => handleChangeRow(activeTab, index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="form-input flex-1"
                      value={row.value}
                      onChange={e => handleChangeRow(activeTab, index, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 rounded"
                      onClick={() => handleRemoveRow(activeTab, index)}
                    >
                      <FaXmark />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddRow(activeTab)}
                  className="bg-primary text-white px-3 py-1 flex items-center rounded mt-2"
                >
                  <FaPlus /> Add Row
                </button>
              </div>
            </div>

            {/* -------- COLOR-WISE Image Upload Section (replaces old single upload) -------- */}
            <div className="grid grid-cols-1 mb-5">
              <h6 className="mb-2 font-semibold text-sm">Product Colors & Images</h6>

              {colors.map((color, idx) => (
                <div key={idx} className="mb-6 border p-4 rounded-md bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder={`Color name (e.g. Red)`}
                      className="form-input flex-1"
                      value={color.name}
                      onChange={(e) => handleColorNameChange(idx, e.target.value)}
                    />
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(idx)}
                        className="ml-2 bg-red-500 text-white px-3 py-2 rounded"
                        title="Remove color"
                      >
                        <FaXmark />
                      </button>
                    )}
                  </div>

                  <label
                    htmlFor={`color-upload-${idx}`}
                    className="flex flex-col items-center justify-center bg-transparent border border-dashed rounded-md cursor-pointer border-default-300 p-6 hover:bg-default-100 transition"
                  >
                    <LuCloudUpload className="size-12 text-default-500 mb-2" />
                    <h5 className="mb-0 font-normal text-base text-default-500">
                      Drag & drop or <span className="text-primary underline">browse</span> images for {color.name || `Color ${idx + 1}`}
                    </h5>
                    <input
                      id={`color-upload-${idx}`}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleColorImageChange(idx, e.target.files)}
                    />
                  </label>

                  <ul className="flex flex-wrap gap-5 mt-5">
                    {color.images.map((file, imageIndex) => (
                      <li
                        key={imageIndex}
                        className="border rounded border-default-200 p-3 w-32 text-center"
                      >
                        <div className="p-2 mx-auto rounded-md size-20 bg-default-200 flex items-center justify-center overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name || `img-${imageIndex}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <h5 className="text-xs truncate">{file.name || `Image ${imageIndex + 1}`}</h5>
                        <button
                          type="button"
                          onClick={() => removeColorImage(idx, imageIndex)}
                          className="mt-2 px-2 py-1 text-xs text-white bg-danger rounded"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-primary text-white px-3 py-2 rounded flex items-center gap-2"
                >
                  <FaPlus /> Add Another Color
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // quick helper: add color and scroll to it
                    addColor();
                    setTimeout(() => {
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }, 100);
                  }}
                  className="bg-transparent text-primary px-3 py-2 border rounded"
                >
                  Add + Scroll
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2 md:justify-end">
              <button
                type="button"
                onClick={resetAll}
                className="bg-transparent text-danger btn border-0 hover:bg-danger/15"
              >
                Reset
              </button>
              <button
                type="submit"
                className={`text-white btn bg-primary flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreat;
