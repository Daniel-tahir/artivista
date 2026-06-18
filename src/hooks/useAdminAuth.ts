import { useCallback, useEffect, useState } from "react";

const AUTH_KEY = "artivistaa_admin_auth";

const VALID_USERNAME = "Shahzaibart@admin.com";
const VALID_PASSWORD = "techtured@315";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem(AUTH_KEY) === "true");
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
