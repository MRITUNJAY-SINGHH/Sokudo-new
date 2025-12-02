import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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

/* ---------------- BOOK TEST RIDE MODAL ---------------- */
const BookFormModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-ride-title"
    >
      <div className="bg-white rounded-xl w-[90%] max-w-[480px] p-6 relative shadow-xl">
        <button
          aria-label="Close test ride form"
          className="absolute top-3 right-3 text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="test-ride-title" className="text-xl font-semibold mb-4">
          Book Test Ride
        </h2>

        <form className="flex flex-col gap-3">
          <input className="border p-2 rounded" placeholder="Your Name" />
          <input className="border p-2 rounded" placeholder="Phone Number" />
          <input className="border p-2 rounded" placeholder="City" />

          <button
            type="button"
            className="btn bg-[#FFB200] text-white mt-2"
            onClick={onClose}
            aria-label="Submit test ride form"
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

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Announcement visible={showAnnouncement} setVisible={setShowAnnouncement} />

      <header
        className={`
          fixed left-0 w-full z-50 transition-all duration-300
          rounded-bl-[20px] rounded-br-[20px]
          ${scrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"}
        `}
        style={{ top: "var(--announcement-offset)" }}
        role="banner"
      >
        <div className="max-w-[1350px] mx-auto flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <button
            onClick={() => {
              closeMobile();
              navigate("/");
            }}
            aria-label="Go to Sokudo homepage"
            className="flex items-center pt-4"
          >
            <img
              src="/Sokudo Logo White.webp"
              alt="Sokudo Electric India logo"
              className="h-18 w-auto"
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center" aria-label="Primary navigation">
            <ul className="flex space-x-6 text-white text-sm uppercase">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group">
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `hover:text-[#FFB200] ${isActive ? "text-[#FFB200]" : ""}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-1"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {item.label}
                      <IoIosArrowDown aria-hidden="true" />
                    </button>
                  )}

                  {item.dropdown && (
                    <div className="absolute top-full left-0 hidden group-hover:block z-50">
                      <ul className="bg-white text-black text-sm mt-2 py-2 px-3 rounded shadow-lg">
                        {item.subItems.map((sub) => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to}
                              className={({ isActive }) =>
                                `block py-2 px-2 rounded hover:bg-gray-100 ${
                                  isActive ? "text-[#FFB200]" : ""
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

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex gap-3 text-white text-sm">
              <NavLink to="/" state={{ scrollTo: "test-ride" }}>
                Test Ride
              </NavLink>
              <span aria-hidden="true">|</span>
              <NavLink to="/variants">Book Now</NavLink>
            </div>

            <ProfileDropdown size={30} />

            <button
              aria-label="Open mobile menu"
              className="lg:hidden text-white p-2"
              onClick={toggleMobile}
            >
              <AiOutlineMenu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-0 z-[99] ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobile}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[90%] max-w-[380px] bg-white transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } rounded-l-2xl`}
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <button
            aria-label="Close mobile menu"
            onClick={closeMobile}
            className="p-3"
          >
            <AiOutlineClose />
          </button>
        </div>
      </aside>

      <BookFormModal open={showBookForm} onClose={() => setShowBookForm(false)} />
    </>
  );
};

export default Header;
