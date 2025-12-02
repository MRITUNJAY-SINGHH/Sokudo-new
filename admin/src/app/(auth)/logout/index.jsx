import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdLogout } from "react-icons/md";
import PageMeta from "@/components/PageMeta";
import MainBackgroundPattern from "@/components/MainBackgroundPattern";
import { logout } from "@/features/auth/authSlice";

// 🔹 SOKUDO Logo Component
const SokudoLogo = () => {
  const logoIcon = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM16 2.5C23.4687 2.5 29.5 8.5313 29.5 16C29.5 23.4687 23.4687 29.5 16 29.5C8.5313 29.5 2.5 23.4687 2.5 16C2.5 8.5313 8.5313 2.5 16 2.5Z"
        className="text-gray-800 dark:text-white"
        fill="currentColor"
      />
      <path
        d="M11.6667 11.6667C11.6667 10.9591 12.2258 10.4 12.9333 10.4H19.0667C19.7742 10.4 20.3333 10.9591 20.3333 11.6667C20.3333 12.3742 19.7742 12.9333 19.0667 12.9333H12.9333C12.2258 12.9333 11.6667 12.3742 11.6667 11.6667Z"
        className="text-gray-800 dark:text-white"
        fill="currentColor"
      />
      <path
        d="M12.9333 15.4667C12.9333 14.7591 13.4925 14.2 14.2 14.2H17.8C18.5075 14.2 19.0667 14.7591 19.0667 15.4667C19.0667 16.1742 18.5075 16.7333 17.8 16.7333H14.2C13.4925 16.7333 12.9333 16.1742 12.9333 15.4667Z"
        className="text-gray-800 dark:text-white"
        fill="currentColor"
      />
      <path
        d="M14.2 19.0667C14.2 18.3591 14.7591 17.8 15.4667 17.8H16.5333C17.2409 17.8 17.8 18.3591 17.8 19.0667C17.8 19.7742 17.2409 20.3333 16.5333 20.3333H15.4667C14.7591 20.3333 14.2 19.7742 14.2 19.0667Z"
        className="text-gray-800 dark:text-white"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <Link to="/" className="flex justify-center items-center gap-2 mb-8">
      {logoIcon}
      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        SOKUDO
      </span>
    </Link>
  );
};

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Call Redux logout action
    dispatch(logout());

    // 🔹 Clear LocalStorage (user info, token, etc.)
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Optionally, redirect after a short delay
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <>
      <PageMeta title="Logged Out" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 px-4">
        <MainBackgroundPattern />

        <div className="card max-w-xl w-full z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8 md:p-12 text-center">
            <SokudoLogo />

            <div className="mx-auto bg-primary/10 text-primary h-20 w-20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <MdLogout size={48} />
            </div>

            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              You've Been Logged Out
            </h4>
            <p className="text-base text-gray-500 dark:text-gray-400 mb-8">
              Your session has been securely ended. Redirecting to login...
            </p>

            <div className="mt-8">
              <Link to="/login">
                <button
                  type="button"
                  className="btn bg-primary hover:bg-primary-dark text-white w-full max-w-xs mx-auto text-base py-2.5 rounded-lg transition duration-200"
                >
                  Sign In Again
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutPage;
