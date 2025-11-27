import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Tạm thời cho phép truy cập không cần check auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>("test");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  
    const checkAuth = async () => {
      try {
        const response = await api.checkAuth();
        setIsAuthenticated(response.isAuthenticated);
        setUsername(response.username || null);
      } catch (error) {
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login(username, password);
      if (response.success && response.user) {
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
      await api.logout();
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

