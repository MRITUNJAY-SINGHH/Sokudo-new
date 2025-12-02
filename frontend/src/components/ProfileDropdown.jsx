import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LuUser, LuPencil, LuShoppingBasket, LuLogOut } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/user/UserSlice';
import toast from 'react-hot-toast';
import { AiOutlineUser } from "react-icons/ai";



const ProfileDropdown = () => {
   const [open, setOpen] = useState(false);
   const dropdownRef = useRef();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { user, isLoggedIn } = useSelector((state) => state.user);

   const handleLogout = () => {
      dispatch(logout());
      setOpen(false);
      navigate('/');
      toast.success('Logged out successfully 👋');
   };

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClick = (e) => {
         if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
   }, []);

   // Get user initial (first letter of name)
   const userInitial =
      user?.name && user.name.length > 0
         ? user.name.charAt(0).toUpperCase()
         : 'U';

   return (
      <div className='relative' ref={dropdownRef}>
         {/* Avatar Button */}
         <button
            type='button'
            aria-label='Close announcement'
            onClick={() => setOpen(!open)}
            className='cursor-pointer rounded-full'
         >
           {isLoggedIn ? (
   <div
      className='flex items-center justify-center size-9.5 rounded-full font-bold text-lg text-white'
      style={{ backgroundColor: '#FFB200' }}
   >
      {userInitial}
   </div>
) : (
   <AiOutlineUser aria-label="Profile" className="text-white size-7" />
)}

         </button>

         {/* Dropdown */}
         {open && (
            <div className='absolute right-0 mt-2 z-50 bg-white shadow-lg rounded-lg border border-gray-200 w-64 sm:w-72'>
               {/* Header */}
               <div className='p-4 border-b border-gray-200 flex items-center gap-3'>
                  <div className='relative inline-block'>
                     {isLoggedIn ? (
                        <div
                           className='flex items-center justify-center size-12 rounded-full font-bold text-2xl text-white'
                           style={{ backgroundColor: '#FFB200' }}
                        >
                           {userInitial}
                        </div>
                     ) : (
                        <AiOutlineUser className="text-white size-7" />
                     )}
                     {isLoggedIn && (
                        <span className='absolute -bottom-0.5 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white'></span>
                     )}
                  </div>
                  <div>
                     <h6 className='font-semibold text-gray-800'>
                        {isLoggedIn ? user?.name || 'User' : 'Guest'}
                     </h6>
                     <p className='text-sm text-gray-500'>
                        {isLoggedIn ? user?.email : 'Not logged in'}
                     </p>
                  </div>
               </div>

               <div className='p-2 text-black bg-white'>
                  {/* If logged in */}
                  {isLoggedIn ? (
                     <>
                        <NavLink
                           to='/account'
                           className={({ isActive }) =>
                              `menu-item flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 ${
                                 isActive ? 'bg-gray-100 text-yellow-600' : ''
                              }`
                           }
                           onClick={() => setOpen(false)}
                        >
                           <LuUser size={18} /> View Profile
                        </NavLink>

                        <NavLink
                           to='/account'
                           className={({ isActive }) =>
                              `menu-item flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 ${
                                 isActive ? 'bg-gray-100 text-yellow-600' : ''
                              }`
                           }
                           onClick={() => setOpen(false)}
                        >
                           <LuPencil size={18} /> Edit Profile
                        </NavLink>

                        <NavLink
                           to='/account'
                           className={({ isActive }) =>
                              `menu-item flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 ${
                                 isActive ? 'bg-gray-100 text-yellow-600' : ''
                              }`
                           }
                           onClick={() => setOpen(false)}
                        >
                           <LuShoppingBasket size={18} /> My Orders
                        </NavLink>

                        <div className='border-t border-gray-200 my-2'></div>

                        <button
                           onClick={handleLogout}
                           aria-label='Logout'
                           className='flex items-center gap-3 w-full text-left py-2 px-3 rounded-md text-red-500 hover:bg-red-600 hover:text-white transition'
                        >
                           <LuLogOut size={18} /> Logout
                        </button>
                     </>
                  ) : (
                     // If not logged in
                     <div className='flex flex-col gap-2'>
                        <Link
                           to='/login'
                           onClick={() => setOpen(false)}
                           className='w-full text-center py-2 rounded-md bg-[#FFB200] text-white font-medium hover:bg-[#e0a100] transition'
                        >
                           Login
                        </Link>
                        <Link
                           to='/register'
                           onClick={() => setOpen(false)}
                           className='w-full text-center py-2 rounded-md border border-[#FFB200] text-[#FFB200] font-medium hover:bg-yellow-50 transition'
                        >
                           Register
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default ProfileDropdown;
