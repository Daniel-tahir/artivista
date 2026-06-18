import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const AUTH_KEY = "artivistaa_admin_auth";

const AdminSessionWatcher = () => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const initialisedRef = useRef(false);

  useEffect(() => {
    if (!initialisedRef.current) {
      initialisedRef.current = true;
      prevPathRef.current = location.pathname;
      return;
    }

    const prev = prevPathRef.current;
    const curr = location.pathname;

    if (prev?.startsWith("/admin") && !curr.startsWith("/admin")) {
      localStorage.removeItem(AUTH_KEY);
    }

    prevPathRef.current = curr;
  }, [location.pathname]);

  return null;
};

export default AdminSessionWatcher;
