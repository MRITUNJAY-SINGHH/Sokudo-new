import React, { useState } from "react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ProductCreat from "./components/ProductCreat";
import Preview from "./components/Preview";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    netExShowroomPrice: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [colors, setColors] = useState([{ name: "", images: [] }]);

  const [sections, setSections] = useState({
    engineAndTransmission: [{ key: "", value: "" }],
    dimensionsAndCapacity: [{ key: "", value: "" }],
    electricals: [{ key: "", value: "" }],
    tyresAndBrakes: [{ key: "", value: "" }],
  });

  return (
    <main>
      <PageBreadcrumb title="Add New" subtitle="Menu" />
      <div className="grid lg:grid-cols-12 grid-cols-1 gap-6">
        <ProductCreat
          formData={formData}
          setFormData={setFormData}
          files={files}
          setFiles={setFiles}
          sections={sections}
          setSections={setSections}
          colors={colors}
          setColors={setColors}
        />
        <Preview formData={formData} colors={colors} sections={sections} />
      </div>
    </main>
  );
};

export default Index;
