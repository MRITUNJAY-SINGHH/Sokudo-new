import React, { useState } from 'react';
import axios from 'axios';
import BlogEditor from './components/BlogEditor';
import ImageUpload from './components/ImageUpload';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// Yup schema
const schema = yup.object().shape({
  title: yup.string().required('Blog title is required'),
  content: yup
    .string()
    .min(20, 'Content should be at least 20 characters')
    .required('Content is required'),
});

const AddBlog = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', content: '' },
  });

  const content = watch('content');

  const handleContentChange = value => {
    setValue('content', value, { shouldValidate: true });
  };

  const onSubmit = async data => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      const categories = data.categories?.split(',').map(c => c.trim());
      const tags = data.tags?.split(',').map(t => t.trim());

      formData.append('categories', JSON.stringify(categories));
      formData.append('tags', JSON.stringify(tags));
      images.forEach(img => formData.append('images', img.file));

      const token = localStorage.getItem('token');

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Blog added successfully!');
      reset();
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add blog. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container bg-card mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="text"
            {...register('title')}
            placeholder="Blog Title"
            className="w-full border p-3 rounded-md focus:outline-none bg-card text-default-700 focus:ring focus:ring-blue-400"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <BlogEditor value={content} onChange={handleContentChange}  />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Categories (comma separated)"
            className="w-full border p-3 bg-card text-default-700 rounded-md mb-2"
            {...register('categories')}
          />
          

          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full bg-card text-default-700 border p-3 rounded-md"
            {...register('tags')}
          />
        </div>

        <ImageUpload
          images={images}
          onImagesChange={setImages}
          onRemoveImage={index => {
            setImages(prev => prev.filter((_, i) => i !== index));
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 text-white rounded-md transition ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adding...' : 'Add Blog'}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
