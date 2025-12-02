import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { MdMail } from 'react-icons/md';
import MainBackgroundPattern from '@/components/MainBackgroundPattern';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

const ForgotPasswordForm = () => {
  const[loading,setLoading]=useState(false);  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async data => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      // if (!res.ok) {
      // setTimeout(()=>{toast.success("otp sent");},2000)
      // }

      toast.success('OTP sent to your email!');

      // store email so we can use on OTP page
      sessionStorage.setItem('resetEmail', data.email);

      // redirect to OTP page
       setTimeout(() => {
      window.location.href = "/verify-otp";
      setLoading(false);
    }, 2000);
    } catch (error) {
      console.log(error);
      toast.error('Error sending OTP!');
    }
  };

  return (
    <>
      <PageMeta title="Reset Password" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 px-4">
        {/* SVG Pattern Background */}
        <MainBackgroundPattern />

        <div className="card max-w-xl w-full z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8 md:p-12">
            <SokudoLogo />
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Forgot Your Password?
              </h4>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-medium text-gray-700 dark:text-gray-300 text-sm mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      className={`form-input ps-10 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      placeholder="you@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email format',
                        },
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

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn bg-primary hover:bg-primary-dark text-white w-full text-base py-2.5 rounded-lg transition duration-200 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send otp'}
                  </button>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    to="/login"
                    className="font-semibold text-primary hover:text-primary-dark transition duration-200"
                  >
                    ← Back to Sign In
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

export default ForgotPasswordForm;
