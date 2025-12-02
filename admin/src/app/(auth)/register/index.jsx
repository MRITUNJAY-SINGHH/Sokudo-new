import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import {
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdCancel,
  MdLock,
  MdPerson,
  MdMail,
} from 'react-icons/md';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import MainBackgroundPattern from '@/components/MainBackgroundPattern';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

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

// Helper component for the validation criteria
const ValidationCriterion = ({ isValid, text }) => (
  <li className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-500' : 'text-gray-500'}`}>
    {isValid ? <MdCheckCircle /> : <MdCancel />}
    <span>{text}</span>
  </li>
);

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const passwordValue = watch('password', '');

  const validationCriteria = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    specialChar: /[^A-Za-z0-9]/.test(passwordValue),
  };

  const onSubmit = async data => {
    const payload = {
      name: data.username,
      email: data.email,
      password: data.password,
    };

    dispatch(registerUser(payload))
      .unwrap()
      .then(() => {
        toast.success('Account created successfully!');
        navigate('/login');
      })
      .catch(err => {
        toast.error(err || 'Something went wrong');
      });
  };

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) toast.success('Registration successful!');
  }, [isError, isSuccess, message]);

  return (
    <>
      <PageMeta title="Create Account" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 px-4">
        {/* SVG Pattern Background */}
        <MainBackgroundPattern />

        {/* --- WIDTH INCREASED HERE --- */}
        <div className="card max-w-xl w-full z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8 md:p-12">
            <SokudoLogo />
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Your Account
              </h4>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                Get started with SOKUDO for free.
              </p>
            </div>

            {/* Social Login Section */}
            {/* <div className="mb-8">
              <Link
                to="#"
                className="btn border border-gray-300 dark:border-gray-600 flex justify-center items-center gap-2 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors duration-200"
              >
                <IconifyIcon icon={'logos:google-icon'} />
               
                Continue with Google
              </Link>
            </div> */}

            {/* OR Divider */}
            <div className="my-6 relative text-center">
              <span className="relative z-10 inline-block px-4 bg-white/0 text-gray-500 dark:text-gray-400 text-sm">
                OR
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="text-left w-full space-y-5">
              {/* Form fields remain the same as the previous version */}
              <div>
                <label
                  htmlFor="username"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className={`form-input ps-10 ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Choose a username"
                    {...register('username', { required: 'Username is required' })}
                  />
                  <span className="absolute start-3 top-1/2 -translate-y-1/2">
                    <MdPerson size={20} className="text-gray-400" />
                  </span>
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                )}
              </div>

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
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
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
                    {...register('password', { required: 'Password is required' })}
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
                {errors.password && !passwordValue && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {passwordValue && (
                <div className="p-3 bg-gray-100/50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
                    Password must contain:
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <ValidationCriterion isValid={validationCriteria.length} text="8+ characters" />
                    <ValidationCriterion
                      isValid={validationCriteria.uppercase}
                      text="1 uppercase"
                    />
                    <ValidationCriterion
                      isValid={validationCriteria.lowercase}
                      text="1 lowercase"
                    />
                    <ValidationCriterion isValid={validationCriteria.number} text="1 number" />
                    <ValidationCriterion
                      isValid={validationCriteria.specialChar}
                      text="1 special"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`form-input ps-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === passwordValue || 'Passwords do not match',
                    })}
                  />
                  <span className="absolute start-3 top-1/2 -translate-y-1/2">
                    <MdLock size={20} className="text-gray-400" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <p className="italic text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                By registering you agree to the SOKUDO{' '}
                <Link to="#" className="underline text-primary hover:text-primary-dark">
                  Terms of Use
                </Link>
              </p>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn bg-primary hover:bg-primary-dark text-white w-full text-base py-2.5 rounded-lg transition duration-200"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-primary hover:text-primary-dark transition duration-200"
                  >
                    Sign In
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

export default RegisterForm;
