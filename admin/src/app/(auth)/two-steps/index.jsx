import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
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

const TwoFactorAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    trigger,
  } = useForm({ mode: 'onChange' });

  const inputRefs = useRef([]);

  const onSubmit = async data => {
    setIsSubmitting(true);
    const otpCode = data.otp.join('');
    console.log('Verifying OTP Code:', otpCode);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // After API call, handle success or failure
    console.log('Verification complete.');
    setIsSubmitting(false);
  };

  const triggerSubmit = handleSubmit(onSubmit);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1].focus();
    }
    // If the last digit is entered, trigger form validation and submission
    if (value.length === 1 && index === 3) {
      trigger().then(isValid => {
        if (isValid) {
          triggerSubmit();
        }
      });
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !getValues(`otp[${index}]`) && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <PageMeta title="Two-Step Verification" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 px-4">
        <MainBackgroundPattern />

        <div className="card max-w-xl w-full z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8 md:p-12">
            <SokudoLogo />
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Two-Step Verification
              </h4>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
                Please enter the 4-digit code sent to your email address.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto">
              <div
                className={`flex justify-center gap-0 mb-6 bg-gray-100 dark:bg-gray-900/50 border rounded-lg divide-x divide-gray-300 dark:divide-gray-600 ${
                  hasErrors ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <input
                    key={index}
                    type="tel" // Use 'tel' for number pads on mobile
                    maxLength="1"
                    className="form-input text-center text-2xl font-bold h-16 w-16 p-0 bg-transparent border-0 focus:ring-0"
                    {...register(`otp[${index}]`, { required: true, pattern: /^[0-9]$/ })}
                    ref={el => (inputRefs.current[index] = el)}
                    onChange={e => handleInputChange(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {hasErrors && !isValid && (
                <p className="text-red-500 text-sm text-center mb-6 -mt-2">
                  Please enter all four digits.
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="btn bg-primary hover:bg-primary-dark text-white w-full text-base py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Verifying...' : 'Confirm Code'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the code?{' '}
                  <Link
                    to="#"
                    className="font-semibold text-primary hover:text-primary-dark transition duration-200"
                  >
                    Resend
                  </Link>
                </p>
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

export default TwoFactorAuthForm;
