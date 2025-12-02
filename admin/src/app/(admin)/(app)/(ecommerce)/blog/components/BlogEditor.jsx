import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const BlogEditor = ({ value, onChange }) => {
  return (
    <div className="w-full border rounded-md shadow-sm bg-card">
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        placeholder="Write your blog content here..."
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        }}
        className="ql-custom-editor  text-default-700"
      />

      <style jsx global>{`
        /* Make only the editor content scrollable */
        .ql-custom-editor .ql-editor {
          min-height: 200px;  /* minimum content height */
          max-height: 320px;  /* fixed scrollable height */
          overflow-y: auto;
        }

        /* Optional: prevent toolbar from being hidden */
        .ql-custom-editor .ql-toolbar {
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .ql-custom-editor {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;
