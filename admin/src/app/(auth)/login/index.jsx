import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/features/auth/authSlice";
import PageMeta from '@/components/PageMeta';
import { MdVisibility, MdVisibilityOff, MdLock, MdMail } from 'react-icons/md';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import MainBackgroundPattern from '@/components/MainBackgroundPattern';

// SOKUDO Logo Component
const SokudoLogo = () => {
  const logoIcon = (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">SOKUDO</span>
    </Link>
  );
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
   const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = (data) => {
    dispatch(login(data));
    // Handle login logic (e.g., API call)
  };

  useEffect(() => {
    if (isSuccess && user) {
      navigate("/"); // Change this path as per your app
    }
  }, [isSuccess, user, navigate]);

  //  Show error message
  useEffect(() => {
    if (isError) {
      alert(message || "Login failed. Please check your credentials.");
    }
  }, [isError, message]);

  return (
    <>
      <PageMeta title="Login" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 px-4">
        {/* SVG Pattern Background */}
        <MainBackgroundPattern />

        <div className="card max-w-xl w-full z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8 md:p-12">
            <SokudoLogo />
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back!</h4>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                Sign in to your SOKUDO account.
              </p>
            </div>

            {/* <div className="mb-8">
              <Link
                to="#"
                className="btn border border-gray-300 dark:border-gray-600 flex justify-center items-center gap-2 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors duration-200"
              >
                <IconifyIcon icon={'logos:google-icon'} />
                Continue with Google
              </Link>
            </div> */}

            <div className="my-6 relative text-center">
              <span className="relative z-10 inline-block px-4 bg-white/0 text-gray-500 dark:text-gray-400 text-sm">
                OR
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm mb-2"
                >
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    className={`form-input ps-10 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email or Username is required',
                    })}
                  />
                  <span className="absolute start-3 top-1/2 -translate-y-1/2">
                    <MdMail size={20} className="text-gray-400" />
                  </span>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ps-10 ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <span className="absolute start-3 top-1/2 -translate-y-1/2">
                    <MdLock size={20} className="text-gray-400" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input id="remember-me" type="checkbox" className="form-checkbox" />
                  <label
                    className="text-gray-700 dark:text-gray-300 text-sm font-medium"
                    htmlFor="remember-me"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn bg-primary hover:bg-primary-dark text-white w-full text-base py-2.5 rounded-lg transition duration-200"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-primary hover:text-primary-dark transition duration-200"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>  
      </div>
    </>
  );
};

export default LoginForm;
