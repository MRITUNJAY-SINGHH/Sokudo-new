import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BlogEditor from "./components/BlogEditor";
import ImageUpload from "./components/ImageUpload";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

// Yup validation schema
const schema = yup.object().shape({
  title: yup.string().required("Blog title is required"),
  content: yup
    .string()
    .min(20, "Content should be at least 20 characters")
    .required("Content is required"),
});

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]); // { file, preview } format
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", content: "", categories: "", tags: ""  },
  });

  const content = watch("content");

  // Fetch blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
       const { data } = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/blogs/${id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

const blog = data.blog;  // extract blog

reset({ title: blog.title, content: blog.content, categories: blog.categories?.join(", ") || "",
  tags: blog.tags?.join(", ") || "", });

const imagePreviews = blog.images.map((url) => ({
  preview: url,
  isNew: false
}));
setImages(imagePreviews);



        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch blog");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, reset]);

  const handleContentChange = (value) => {
    setValue("content", value, { shouldValidate: true });
  };

  const handleImageChange = (newImages) => {
    if (images.length + newImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      const allowed = newImages.slice(0, 5 - images.length);
      setImages([...images, ...allowed]);
    } else {
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
  setImages(prev => prev.filter((_, i) => i !== index));
};


  const handleSubmitForm = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("categories", data.categories);
formData.append("tags", data.tags);


      // Append new files only
      const existing = images.filter((img) => !img.file).map((img) => img.preview);
formData.append("existingImages", JSON.stringify(existing));

images.forEach((img) => {
  if (img.file) formData.append("images", img.file);
});


      const token = localStorage.getItem("token");

      await axios.put(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Blog updated successfully!");
      navigate("/all-blog");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            {...register("title")}
            placeholder="Blog Title"
            className="w-full border p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Content */}
        <div>
          <BlogEditor value={content} onChange={handleContentChange} />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>

        {/* Categories */}
<div>
  <input
    type="text"
    {...register("categories")}
    placeholder="Categories (comma separated e.g. tech, business)"
    className="w-full border p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
  />
</div>

{/* Tags */}
<div>
  <input
    type="text"
    {...register("tags")}
    placeholder="Tags (comma separated e.g. react, javascript)"
    className="w-full border p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
  />
</div>


        {/* Images */}
        <ImageUpload
  images={images}
  onImagesChange={setImages}
  onRemoveImage={handleRemoveImage}
/>



        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 text-white rounded-md transition ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
