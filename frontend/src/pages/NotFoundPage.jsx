import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section
        className="relative min-h-[90vh] bg-gray-700 flex items-center px-4 py-8"
        style={{
          marginTop: "calc(var(--announcement-offset))",
        }}
      >
       

      {/* TOP BAR */}
     

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">

          {/* CARTOON + BOARD */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">

            {/* CARTOON */}
            <div className="text-8xl md:text-[120px]">
              🧑‍🏫
            </div>

            {/* BOARD */}
            <div className="border-4 border-gray-400 p-8 rounded-lg bg-white shadow-md">
              <h1 className="text-5xl font-bold text-gray-600">404</h1>
              <p className="mt-2 text-gray-500">
                This Page Not Available
              </p>
            </div>
          </div>

          {/* TEXT */}
          <p className="mt-10 text-lg text-gray-300">
            <span className="text-red-500 font-semibold">Ohh…..</span>
            You requested the page that is no longer there.
          </p>

          {/* BUTTON */}
          <Link
            to="/"
            className="btn inline-block mt-8 px-6 py-3 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition"
          >
            Back To Home
          </Link>

          {/* FOOTER */}
          <p className="mt-10 text-sm text-gray-400">
            © {new Date().getFullYear()} Sokudo. All Rights Reserved
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
