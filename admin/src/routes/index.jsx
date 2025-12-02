import { Navigate, Route, Routes } from 'react-router-dom';
import { layoutsRoutes, singlePageRoutes } from './Routes';
import PrivateRoute from '@/routes/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {layoutsRoutes.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={
            route.protected ? (
              <PrivateRoute>{route.element}</PrivateRoute>
            ) : (
              route.element
            )
          }
        />
      ))}

      {singlePageRoutes.map((route) => (
        <Route key={route.name} path={route.path} element={route.element} />
      ))}

      {/* Not found */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
