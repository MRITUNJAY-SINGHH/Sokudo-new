import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageWrapper from "@/components/PageWrapper";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Sidebar + Topbar tabhi render hongi jab loggedIn true ho
  return <PageWrapper>{children}</PageWrapper>;
};

export default PrivateRoute;
