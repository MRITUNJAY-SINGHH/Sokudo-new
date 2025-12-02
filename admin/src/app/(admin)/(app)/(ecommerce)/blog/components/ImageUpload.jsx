import React from "react";
import toast from "react-hot-toast";

const ImageUpload = ({ images, onImagesChange, onRemoveImage }) => {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      const allowed = selectedFiles.slice(0, 5 - images.length);
      addFiles(allowed);
      return;
    }

    addFiles(selectedFiles);
  };

  const addFiles = (filesArray) => {
    const mappedFiles = filesArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    onImagesChange((prev) => [...prev, ...mappedFiles]);
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Upload Images</label>

      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={images.length >= 5}
        />
        <span>Click or drag images (max 5)</span>
      </label>

      {/* Image Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative group border rounded-md overflow-hidden">
            <img
  src={img.preview}
  className="w-full h-32 object-cover"
/>


            <button
              type="button"
              onClick={() => onRemoveImage(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
