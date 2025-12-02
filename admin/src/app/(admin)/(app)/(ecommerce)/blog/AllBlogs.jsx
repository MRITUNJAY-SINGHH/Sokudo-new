import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiPencilAlt, HiTrash } from 'react-icons/hi';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs(data.blogs || []); // ✅ fix
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async id => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Blog deleted successfully');
      // remove from UI
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading blogs...</p>;

  return (
    <div className="container bg-card mx-auto p-6">
      <h1 className="text-3xl text-default-700 font-bold mb-6">All Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div
              key={blog._id}
              className="bg-card text-default-700  border rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden flex flex-col"
            >
              <img
                src={blog.images[0]}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl text-default-700 font-semibold mb-2">{blog.title}</h2>
                  <p className="text-default-700 line-clamp-3">
                    {blog.content.replace(/<[^>]+>/g, '')}
                  </p>

                  {/* ✅ Categories */}
{/* ✅ Categories */}
{blog.categories && (
  <p className="text-sm text-gray-400 mt-3 flex flex-wrap items-center gap-2">
    <span className="font-medium text-gray-500">Categories:</span>
    {(Array.isArray(blog.categories)
      ? blog.categories
      : blog.categories.split(",")
    )
      .slice(0, 5)
      .map((c, i) => (
        <span
          key={i}
          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs"
        >
          #{c?.trim()}
        </span>
      ))}
    {(Array.isArray(blog.categories)
      ? blog.categories.length > 5
      : blog.categories.split(",").length > 5) && (
      <span className="text-gray-500 text-xs">...</span>
    )}
  </p>
)}

{/* ✅ Tags */}
{blog.tags && (
  <p className="text-sm text-gray-500 mt-2 flex flex-wrap items-center gap-2">
    <span className="font-medium text-gray-600">Tags:</span>
    {(Array.isArray(blog.tags)
      ? blog.tags
      : blog.tags.split(",")
    )
      .slice(0, 5)
      .map((t, i) => (
        <span
          key={i}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
        >
          #{t?.trim()}
        </span>
      ))}
    {(Array.isArray(blog.tags)
      ? blog.tags.length > 5
      : blog.tags.split(",").length > 5) && (
      <span className="text-gray-500 text-xs">...</span>
    )}
  </p>
)}


                </div>

                {/* Buttons container */}
                <div className="mt-4 flex gap-2 justify-start">
                  <Link
                    to={`/edit-blog/${blog._id}`}
                    className="flex items-center gap-1 px-3 py-1 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition text-sm"
                  >
                    <HiPencilAlt className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex items-center gap-1 px-3 py-1 text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition text-sm"
                  >
                    <HiTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
