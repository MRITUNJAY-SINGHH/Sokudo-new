import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import PageMeta from '@/components/PageMeta';
import { MdSend } from 'react-icons/md';
import MainBackgroundPattern from '@/components/MainBackgroundPattern';

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

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span className="text-2xl font-bold text-primary">We are live!</span>;
  }
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
      <div className="text-center">
        <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          {String(days).padStart(2, '0')}
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Days</p>
      </div>
      <div className="text-2xl font-light text-gray-300 dark:text-gray-600 pb-5">:</div>
      <div className="text-center">
        <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          {String(hours).padStart(2, '0')}
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hours</p>
      </div>
      <div className="text-2xl font-light text-gray-300 dark:text-gray-600 pb-5">:</div>
      <div className="text-center">
        <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          {String(minutes).padStart(2, '0')}
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Minutes</p>
      </div>
      <div className="text-2xl font-light text-gray-300 dark:text-gray-600 pb-5">:</div>
      <div className="text-center">
        <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          {String(seconds).padStart(2, '0')}
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Seconds</p>
      </div>
    </div>
  );
};

const ComingSoonPage = () => {
  const targetDate = new Date('June 30, 2026 16:37:52');

  return (
    <>
      <PageMeta title="Coming Soon" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 px-4">
        {/* SVG Pattern Background */}
        <MainBackgroundPattern />

        <div className="card max-w-2xl w-full z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8 md:p-12 text-center">
            <SokudoLogo />

            <div className="mt-4">
              <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                We're Launching Soon!
              </h4>
              <p className="text-base text-gray-500 dark:text-gray-400 mb-8">
                Something exciting is on the way. Stay tuned for the big reveal.
              </p>
            </div>

            <div className="my-10">
              <Countdown date={targetDate} renderer={CountdownRenderer} />
            </div>

            <div className="mt-10">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Be the first to know!
              </h5>
              <p className="mb-6 text-base text-gray-500 dark:text-gray-400">
                Sign up for updates and we'll notify you when we launch.
              </p>

              <form action="#" className="max-w-md mx-auto">
                <div className="relative flex w-full">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="form-input"
                  />
                  <button
                    type="submit"
                    className="absolute end-1 top-1/2 -translate-y-1/2 btn bg-primary text-white btn-sm inline-flex items-center gap-2"
                  >
                    <MdSend size={16} />
                    Notify Me
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;
