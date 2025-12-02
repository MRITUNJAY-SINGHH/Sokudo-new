import React, { useMemo } from "react";

const Preview = ({ formData, colors, sections }) => {
  // 🔥 1) Get ONLY first color
  const firstColor = colors?.[0];

  // 🔥 2) Get only first image of first color
  const firstImage = useMemo(() => {
  if (firstColor?.images?.length > 0) {
    return URL.createObjectURL(firstColor.images[0]);
  }
  return null;
}, [firstColor?.images]);

  return (
    <div className="lg:col-span-3 col-span-1">
      <div className="sticky top-20">
        <div className="card">
          <div className="card-body">
            <h6 className="mb-4 card-title">Product Card Preview</h6>

            {/* --- Featured Image (ONLY 1st color → 1st image) --- */}
            <div className="px-5 py-8 rounded-md bg-info/10">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt="Product"
                  className="block mx-auto h-44 object-cover rounded-md"
                />
              ) : (
                <div className="h-44 flex items-center justify-center text-default-500">
                  No Image Selected
                </div>
              )}
            </div>

            {/* --- Product Info --- */}
            <div className="mt-3">
              <h5 className="mb-2 text-lg text-default-800 font-medium">
                ₹{formData.netExShowroomPrice || "0.00"}
              </h5>
              <h6 className="mb-1 text-[15px] font-semibold text-default-800">
                {formData.name || "Product Name"}
              </h6>
              <p className="text-default-600">
                Stock: {formData.stock || "0"} units
              </p>
            </div>

            {/* --- Description --- */}
            <h6 className="mt-4 mb-2 card-title">Description</h6>
            <p className="text-sm text-default-600 whitespace-pre-line">
              {formData.description || "Product description will appear here..."}
            </p>

            {/* --- All Images (ONLY from first color) --- */}
            {firstColor?.images?.length > 0 && (
              <>
                <h6 className="mt-4 mb-2 card-title">All Images</h6>

                <div className="grid grid-cols-3 gap-3">
                  {firstColor.images.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`img-${idx}`}
                      className="rounded-md object-cover h-24 w-full"
                    />
                  ))}
                </div>
              </>
            )}

            {/* --- Specifications --- */}
            <h6 className="mt-5 mb-3 card-title">Specifications</h6>
            {Object.keys(sections).map((sectionKey) => {
              const sectionData = sections[sectionKey];

              const titles = {
                engineAndTransmission: "Engine and Transmission",
                dimensionsAndCapacity: "Dimensions and Capacity",
                electricals: "Electricals",
                tyresAndBrakes: "Tyres and Brakes",
              };

              const hasData = sectionData.some(
                (row) => row.key.trim() && row.value.trim()
              );

              return (
                hasData && (
                  <div key={sectionKey} className="mb-4">
                    <h6 className="font-semibold text-default-800 mb-2">
                      {titles[sectionKey]}
                    </h6>

                    <ul className="text-sm text-default-700 space-y-1 list-disc pl-5">
                      {sectionData.map((row, idx) =>
                        row.key.trim() && row.value.trim() ? (
                          <li key={idx}>
                            <span className="font-medium">{row.key}: </span>
                            {row.value}
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
