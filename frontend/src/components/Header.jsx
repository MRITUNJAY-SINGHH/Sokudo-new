import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Announcement from "./Announcement";
import ProfileDropdown from "./ProfileDropdown";

const menuItems = [
  {
    label: "About Us",
    dropdown: true,
    subItems: [
      { label: "Company", to: "/company" },
      { label: "R&D", to: "/R&D" },
    ],
  },
  { label: "Our Models", to: "/our-model" },
  {
    label: "Join Sokudo Family",
    dropdown: true,
    subItems: [
      { label: "Careers", to: "/career" },
      { label: "Dealership", to: "/dealership" },
    ],
  },
  { label: "Testimonial", to: "/testimonial" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

/* ------------------------------------------------------
   BOOK TEST RIDE MODAL
------------------------------------------------------ */
const BookFormModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl w-[90%] max-w-[480px] p-6 relative shadow-xl">
        <button aria-label='Close announcement' className="absolute top-3 right-3 text-xl" onClick={onClose}>
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Book Test Ride</h2>

        <form className="flex flex-col gap-3">
          <input className="border p-2 rounded" placeholder="Your Name" />
          <input className="border p-2 rounded" placeholder="Phone Number" />
          <input className="border p-2 rounded" placeholder="City" />

          <button
            type="button"
            aria-label='Close announcement'
            className="btn bg-[#FFB200] text-white mt-2"
            onClick={onClose}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const navigate = useNavigate();

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  const handleLogoClick = () => {
    closeMobile();
    navigate("/");
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (to) => {
    closeMobile();
    navigate(to);
    // Scroll to top smoothly after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Disable scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Detect scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Announcement
        visible={showAnnouncement}
        setVisible={setShowAnnouncement}
      />

      {/* Header */}
      <header
        className={`
    fixed left-0 w-full z-50 transition-all duration-300
    rounded-bl-[20px] rounded-br-[20px]
    ${scrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"}
  `}
        style={{
          top: "var(--announcement-offset)",
        }}
      >
        <div className="max-w-[1350px] mx-auto py-0 flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className="flex-shrink-0 pt-4">
            <button
              onClick={() => {
                
                handleLogoClick()
              }}
              aria-label="Go to home"
              className="flex items-center"
            >
              <img
                src="/Sokudo Logo White.webp"
                alt="Sokudo Logo"
                className="h-18 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex space-x-6 text-white text-sm uppercase">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group cursor-pointer">
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      onClick={() => handleNavClick(item.to)}
                      className={({ isActive }) =>
                        `hover:text-[#FFB200] ${
                          isActive ? "text-[#FFB200]" : ""
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <span className="flex items-center gap-1">
                      {item.label}
                      {item.dropdown && (
                        <IoIosArrowDown className="text-lg transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </span>
                  )}

                  {item.dropdown && item.subItems?.length > 0 && (
                    <div className="absolute top-full left-0 group-hover:block hidden z-50">
                      <ul className="bg-white text-black text-sm mt-2 py-2 px-3 rounded shadow-lg min-w-[200px]">
                        {item.subItems.map((sub) => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to}
                              onClick={() => handleNavClick(sub.to)}
                              className={({ isActive }) =>
                                `block py-2 px-2 rounded hover:bg-gray-100 ${
                                  isActive ? "text-[#FFB200]" : "text-black"
                                }`
                              }
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* DESKTOP — Test Ride | Book Now */}
            <div className="hidden lg:flex items-center gap-3 text-[#ffffff] font-normal">
              <NavLink
                to="/test-ride"
                
                className="btn !py-[8px]"
              >
                Test Ride
              </NavLink>

              <span className="text-[#ffffff]">|</span>

              <NavLink
                to="/variants" // BOOK NOW ka jo original link tha wahi lagaya
                className="hover:text-yellow-500"
              >
                Book Now
              </NavLink>
            </div>

            {/* Profile */}
            <ProfileDropdown size={30} />

            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              className="lg:hidden inline-flex items-center justify-center p-2 text-white"
              onClick={toggleMobile}
            >
              <AiOutlineMenu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[99] transition ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobile}
        />

        {/* Drawer Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-[90%] max-w-[380px] bg-white text-black shadow-2xl transform transition-transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } rounded-l-2xl overflow-hidden`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b">
            <NavLink to="/" onClick={closeMobile}>
              <img
                src="/Sokudo Logo Black.webp"
                alt="Sokudo"
                className="h-15 w-auto "
              />
            </NavLink>
            <button
              aria-label="Close menu"
              onClick={closeMobile}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <AiOutlineClose size={22} />
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="px-2">
            <ul className="divide-y divide-gray-200">
              {menuItems.map((item) => {
                const isOpen = openDropdown === item.label;
                if (item.dropdown && item.subItems?.length) {
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-label='Open dropdown'
                        className="w-full flex items-center justify-between py-3 px-2 text-left uppercase text-[13px]"
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.label)
                        }
                      >
                        <span className="text-gray-900">{item.label}</span>
                        <IoIosArrowDown
                          className={`text-lg transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-[max-height] duration-300 ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <ul className="py-1">
                          {item.subItems.map((sub) => (
                            <li key={sub.label}>
                              <NavLink
                                to={sub.to}
                                onClick={closeMobile}
                                className={({ isActive }) =>
                                  `block py-2 pl-5 text-[13px] ${
                                    isActive
                                      ? "text-[#FFB200]"
                                      : "text-gray-700"
                                  }`
                                }
                              >
                                {sub.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `block py-3 px-2 uppercase text-[13px] ${
                          isActive ? "text-[#FFB200]" : "text-gray-900"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Buttons */}
            <div className="px-2 pt-4 flex flex-col gap-3">
              {/* TEST RIDE Mobile */}
              <NavLink
                to="/test-ride"
                className="w-full inline-flex justify-center px-4 py-2 text-[13px] rounded-md bg-[#FFB200] text-white font-medium"
              >
                TEST RIDE
              </NavLink>

              {/* EXPLORE Mobile */}
              <NavLink
                to="/variants"
                onClick={closeMobile}
                className="w-full inline-flex justify-center px-4 py-2 text-[13px] rounded-md border border-black/20 font-medium"
              >
                BOOK NOW
              </NavLink>
            </div>
          </nav>
        </aside>
      </div>

      {/* Test Ride Modal */}
      <BookFormModal
        open={showBookForm}
        onClose={() => setShowBookForm(false)}
      />
    </div>
  );
};

export default Header;
