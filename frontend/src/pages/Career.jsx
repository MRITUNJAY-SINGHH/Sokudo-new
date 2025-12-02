import React, { useState } from "react";
import Banner from "/car.webp";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

const Career = () => {
  const [cvName, setCvName] = useState("No file chosen");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ✅ ONLY UI purpose
  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    setCvName(file ? file.name : "No file chosen");
  };

  const onSubmit = async (data) => {
    try {
      toast.loading("Submitting...");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.contact);
      formData.append("position", "");
      formData.append("message", data.message);

      // ✅ CORRECT FILE ACCESS (FileList → File)
      const fileObj = data.cv?.[0];
      if (fileObj) {
        formData.append("cv", fileObj);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/career`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();

      if (res.data.success) {
        toast.success("🎉 Application submitted successfully!");
        reset();
        setCvName("No file chosen");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* TOP BANNER */}
      <section
        className="relative isolate h-[420px] flex justify-center items-center text-white"
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: "cover",
        }}
      >
        <h1 className="heading">Career</h1>
      </section>

      {/* FORM */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="border rounded-2xl p-8 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Be a Part of <span className="text-[#ffb200]">SOKUDO</span>
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium">
                Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="mt-2 w-full rounded-xl border px-4 py-2.5"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* CONTACT */}
            <div>
              <label className="block text-sm font-medium">
                Contact Number *
              </label>
              <input
                {...register("contact", {
                  required: "Contact number required",
                })}
                className="mt-2 w-full rounded-xl border px-4 py-2.5"
              />
              {errors.contact && (
                <p className="text-red-500 text-xs">
                  {errors.contact.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium">
                Email *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email required",
                })}
                className="mt-2 w-full rounded-xl border px-4 py-2.5"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* CV */}
            <div>
              <label className="block text-sm font-medium">
                Upload CV *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("cv", { required: "CV is required" })}
                onChange={handleCvChange}
                className="mt-2 w-full rounded-xl border cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Selected: {cvName}
              </p>
              {errors.cv && (
                <p className="text-red-500 text-xs">{errors.cv.message}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-sm font-medium">
                Message *
              </label>
              <textarea
                rows={4}
                {...register("message", { required: "Message required" })}
                className="mt-2 w-full rounded-xl border px-4 py-2.5"
              />
              {errors.message && (
                <p className="text-red-500 text-xs">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button
                type="reset"
                className="flex-1 border rounded-full py-3"
                onClick={() => {
                  reset();
                  setCvName("No file chosen");
                }}
              >
                RESET
              </button>

              <button
                type="submit"
                className="flex-1 bg-[#ffb200] rounded-full py-3 font-semibold"
              >
                SUBMIT APPLICATION
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Career;
