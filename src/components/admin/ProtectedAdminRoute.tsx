import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import PageLoader from "@/components/performance/PageLoader";

const ProtectedAdminRoute = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const location = useLocation();

  if (isAuthenticated === null) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <button
        onClick={logout}
        className="fixed right-4 top-4 z-50 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-400 backdrop-blur-md transition-all hover:border-red-500/50 hover:bg-red-500/20"
      >
        Logout
      </button>
      <Outlet />
    </>
  );
};

export default ProtectedAdminRoute;
