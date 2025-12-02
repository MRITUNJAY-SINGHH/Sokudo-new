import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [counter, setCounter] = useState(30);
  const [resendActive, setResendActive] = useState(false);

  // Timer logic
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendActive(true);
    }
  }, [counter]);

  // 👇 RESEND OTP FUNCTION 
  const resendOtp = async () => {
    setResendActive(false);
    setCounter(30);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (!res.ok) return alert(result.message);

      toast.success("OTP resent to your email!")
    } catch (error) {
      toast.error("Error resending OTP");
    }
  };

  // Submit OTP
  const onSubmit = async data => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: data.otp }),
      });

      const result = await res.json();

      if (!res.ok) return alert(result.message);

      sessionStorage.setItem("resetOTP", data.otp);

      toast.success("OTP Verified!");
      navigate("/create-password");

    } catch (err) {
      toast.error("Verification failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 shadow rounded w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
        <p className="text-sm mb-4">
          OTP sent to: <b>{email}</b>
        </p>

        <input
          type="text"
          className="border p-2 w-full text-center tracking-widest text-lg"
          placeholder="Enter 6-digit OTP"
          {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
        />
        {errors.otp && <p className="text-red-500 text-sm mt-1">Enter valid 6 digit OTP</p>}

        <button className="bg-black text-white w-full mt-4 py-2 rounded">
          Verify OTP
        </button>

        {/* Timer OR Resend OTP */}
        <div className="text-center mt-4 text-sm">
          {!resendActive ? (
            <span>Resend OTP in <b>{counter}s</b></span>
          ) : (
            <button
              type="button"
              onClick={resendOtp}
              className="text-blue-600 font-semibold"
            >
              Resend OTP
            </button>
          )}
        </div>

      </form>
    </div>
  );
};

export default VerifyOtp;
