import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../services/api/index";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const response = await authApi.checkAuth();
        if (!isMounted) return;
        setIsAuthenticated(response.isAuthenticated);
        setUsername(response.user?.username || null);
      } catch (error) {
        if (!isMounted) return;
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.user) {
        // Server sets HTTP-Only cookie in response header
        // Cookie is automatically stored by browser, we can't access it from JS
        setIsAuthenticated(true);
        setUsername(response.user.username);
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUsername(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      // Server deletes HTTP-Only cookie
      setIsAuthenticated(false);
      setUsername(null);
    } catch (error) {
      // Even if API call fails, clear local state
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

