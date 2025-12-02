import { lazy } from 'react';
import AllBlogs from '../app/(admin)/(app)/(ecommerce)/blog/AllBlogs';
import AddBlog from '../app/(admin)/(app)/(ecommerce)/blog/AddBlog';
import EditBlog from '../app/(admin)/(app)/(ecommerce)/blog/EditBlog';
import AddCoupon from '../app/(admin)/(app)/(ecommerce)/coupon/AddCoupon';
import ContactList from '../app/(admin)/(app)/(ecommerce)/enquiry/ContactList';
import DealershipList from '../app/(admin)/(app)/(ecommerce)/enquiry/DeaalershipList';
import CareerForms from '../app/(admin)/(app)/(ecommerce)/enquiry/CareerForms';
import EditProduct from '../app/(admin)/(app)/(ecommerce)/product-create/components/ProductEdit';
import CustomerDetailTable from '../app/(admin)/(app)/(ecommerce)/customers/CustomersList';
import VerifyOtp from '../app/(auth)/verifyotp/VerifyOtp';
import TransactionsPage from '../app/(admin)/(app)/(ecommerce)/transaction';
import CouponList from '../app/(admin)/(app)/(ecommerce)/coupon/AllCoupons';
import InventoryTable from '../app/(admin)/(app)/(ecommerce)/product inventory/InventoryTable';
import LeadList from '../app/(admin)/(app)/(ecommerce)/enquiry/Leads';
import AdminTestRideList from '../app/(admin)/(app)/(ecommerce)/orders/AdminTestRideList';
// import ViewBlogModal from '../app/(admin)/(app)/(ecommerce)/blog/ViewBlogModal';

// admin Ecommerce

const Cart = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/cart'));
const Checkout = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/checkout'));
const OrderOverview = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/order-overview'));
const Orders = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/orders'));
const ProductCreate = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/product-create'));
const ProductGrid = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/product-grid'));
const ProductList = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/product-list'));
const ProductOverview = lazy(() => import('@/app/(admin)/(app)/(ecommerce)/product-overview'));

const UserList = lazy(() => import('@/app/(admin)/(app)/(users)/users-list'));

const Ecommerce = lazy(() => import('@/app/(admin)/(dashboards)/index'));

// layouts
const DarkMode = lazy(() => import('@/app/(admin)/(layouts)/dark-mode'));
const RTL = lazy(() => import('@/app/(admin)/(layouts)/rtl-mode'));
const SideNavCompact = lazy(() => import('@/app/(admin)/(layouts)/sidenav-compact'));
const SideNavDark = lazy(() => import('@/app/(admin)/(layouts)/sidenav-dark'));
const SideNavHidden = lazy(() => import('@/app/(admin)/(layouts)/sidenav-hidden'));
const SideNavHover = lazy(() => import('@/app/(admin)/(layouts)/sidenav-hover'));
const SideNavHoverActive = lazy(() => import('@/app/(admin)/(layouts)/sidenav-hover-active'));
const SideOffcanvas = lazy(() => import('@/app/(admin)/(layouts)/sidenav-offcanvas'));
const SideNavSmall = lazy(() => import('@/app/(admin)/(layouts)/sidenav-small'));

//auth
const CreatePassword = lazy(() => import('@/app/(auth)/create-password'));
const Login = lazy(() => import('@/app/(auth)/login'));
const Register = lazy(() => import('@/app/(auth)/register'));
const ResetPassword = lazy(() => import('@/app/(auth)/reset-password'));
const VerifyEmail = lazy(() => import('@/app/(auth)/verify-email'));
const Logout = lazy(() => import('@/app/(auth)/logout'));
const TwoStep = lazy(() => import('@/app/(auth)/two-steps'));

//Other~

const Error404 = lazy(() => import('@/app/(others)/404'));
const CommingSoon = lazy(() => import('@/app/(others)/coming-soon'));
const Maintenance = lazy(() => import('@/app/(others)/maintenance'));
const Offline = lazy(() => import('@/app/(others)/offline'));
export const layoutsRoutes = [
  {
    path: '/',
    name: 'Ecommerce',
    element: <Ecommerce />,
    protected:true,
  },
  {
    path: '/index',
    name: 'Ecommerce',
    element: <Ecommerce />,
    protected:true,
  },
  {
    path: '/cart',
    name: 'Cart',
    element: <Cart />,
    protected:true,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    element: <Checkout />,
    protected:true,
  },
  {
    path: '/order-overview',
    name: 'OrderOverview',
    element: <OrderOverview />,
    protected:true,
  },
  {
    path: '/orders',
    name: 'Orders',
    element: <Orders />,
    protected:true,
  },
  {
    path: '/product-create',
    name: 'ProductCreate',
    element: <ProductCreate />,
    protected:true,
  },
  {
    path: '/product-edit/:id',
    name: 'ProductEdit',
    element: <EditProduct />,
    protected:true,
  },
  {
    path: '/product-grid',
    name: 'ProductGrid',
    element: <ProductGrid />,
    protected:true,
  },
  {
    path: '/product-list',
    name: 'ProductList',
    element: <ProductList />,
    protected:true,
  },
  {
    path: '/product-overview',
    name: 'ProductOverview',
    element: <ProductOverview />,
    protected:true,
  },
  {
    path: '/inventory',
    name: 'ProductInventory',
    element: <InventoryTable/>,
    protected:true,
  },

  {
    path: '/users-list',
    name: 'UserList',
    element: <UserList />,
    protected:true,
  },
  {
    path:'/all-blog',
    name: 'AllBlog',
    element: <AllBlogs />,
    protected:true,
  },
   {
    path:'/add-blog',
    name: 'AddBlog',
    element: <AddBlog />,
    protected:true,
  },
  {
    path:'/edit-blog/:id',
    name: 'EditBlog',
    element: <EditBlog />,
    protected:true,
  },
  {
    path: '/customers-list',
    name: 'CustmersList',
    element: <CustomerDetailTable />,
    protected:true,
  },
   {
    path: '/transactions',
    name: 'Transaction',
    element: <TransactionsPage />,
    protected:true,
  },


  {
    path:'/add-coupon',
    name: 'AddCoupon',
    element: <AddCoupon />,
    protected:true,
  },
  {
    path:'/all-coupon',
    name: 'AddCoupon',
    element: <CouponList />,
    protected:true,
  },

  {
    path:'/contacts-list',
    name: 'Contact',
    element: <ContactList />,
    protected:true,
  },
  {
    path:'/dealership-list',
    name: 'Dealership',
    element: <DealershipList />,
    protected:true,
  },
  {
    path:'/leads',
    name: 'Leads',
    element: <LeadList />,
    protected:true,
  },
  {
    path:'/test-ride',
    name: 'TestRide',
    element: <AdminTestRideList />,
    protected:true,
  },
  {
    path:'/careerform-list',
    name: 'careerform',
    element: <CareerForms />,
    protected:true,
  },







  // {
  //   path:'/modal-blog',
  //   name: 'ViewBlogModal',
  //   element: <ViewBlogModal />,
  //   protected:true,
  // },

  {
    path: '/',
    name: 'Ecommerce',
    element: <Ecommerce />,
    protected:true,
  },

  {
    path: '/dark-mode',
    name: 'DarkMode',
    element: <DarkMode />,
  },
  {
    path: '/rtl-mode',
    name: 'RtlMode',
    element: <RTL />,
  },
  {
    path: '/sidenav-compact',
    name: 'SideNavCompact',
    element: <SideNavCompact />,
  },
  {
    path: '/sidenav-dark',
    name: 'SideNavDark',
    element: <SideNavDark />,
  },
  {
    path: '/sidenav-hidden',
    name: 'SideNavHidden',
    element: <SideNavHidden />,
  },
  {
    path: '/sidenav-hover',
    name: 'SideNavHover',
    element: <SideNavHover />,
  },
  {
    path: '/sidenav-offcanvas',
    name: 'SideNavOffcanvas',
    element: <SideOffcanvas />,
  },
  {
    path: '/sidenav-small',
    name: 'SideNavSmall',
    element: <SideNavSmall />,
  },
  {
    path: '/sidenav-hover-active',
    name: 'SideNavHoverActive',
    element: <SideNavHoverActive />,
  },
];
export const singlePageRoutes = [
  {
    path: '/login',
    name: 'Login',
    element: <Login />,
  },
  {
    path: '/register',
    name: 'Register',
    element: <Register />,
  },
  {
    path: '/create-password',
    name: 'CreatePassword',
    element: <CreatePassword />,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    element: <ResetPassword />,
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    element: <VerifyEmail />,
  },
   {
    path: '/verify-otp',
    name: 'VerifyOtp',
    element: <VerifyOtp />,
  },
  {
    path: '/logout',
    name: 'Logout',
    element: <Logout />,
  },
  {
    path: '/two-steps',
    name: 'TwoStep',
    element: <TwoStep />,
  },

  {
    path: '/404',
    name: '404',
    element: <Error404 />,
  },
  {
    path: '/coming-soon',
    name: 'ComingSoon',
    element: <CommingSoon />,
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    element: <Maintenance />,
  },
  {
    path: '/offline',
    name: 'Offline',
    element: <Offline />,
  },
];
