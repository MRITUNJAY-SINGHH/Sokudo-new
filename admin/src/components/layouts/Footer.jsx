import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appName = 'Admin Panel';

  return (
    <footer className="mt-auto footer flex items-center py-5 border-t border-default-200">
      <div className="lg:px-8 px-6 w-full flex md:justify-between justify-center gap-4">
        <div>
          Copyright© SOKUDO ELECTRIC INDIA PRIVATE LIMITED {currentYear} All Rights Reserved.{' '}
        </div>
        <div className="md:flex hidden gap-2 items-center md:justify-end">
          Design &amp; Develop by
          <a
            href="https://thinktiveitsolution.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary ml-1"
          >
            Thinktive IT Solution
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
