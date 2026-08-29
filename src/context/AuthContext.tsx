import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { syncAuthSession, syncFavoritesWithDb } from "../lib/api";
import AuthModal from "../components/common/AuthModal";

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  googleId?: string;
  isMock?: boolean;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginWithGoogle: (credential: string) => Promise<void>;
  mockLogin: (role: "admin" | "user") => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  authReason: string | null;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMode: "ai" | "human";
  setChatMode: (mode: "ai" | "human") => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("pp_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<"ai" | "human">("ai");

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("pp_theme");
      if (stored === "light" || stored === "dark") return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch {
      // Ignore
    }
    return "light";
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("pp_theme", theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const openAuthModal = (reason?: string) => {
    setAuthReason(reason || null);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthReason(null);
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const decoded: any = jwtDecode(credential);
      const email = decoded.email || "";
      const name = decoded.name || "Google User";
      const picture = decoded.picture || "";

      const dbProfile = await syncAuthSession(email, name);

      const profile: UserProfile = {
        name: dbProfile?.name || name,
        email: dbProfile?.email || email,
        picture: picture,
        googleId: decoded.sub,
        isMock: false,
        role: dbProfile?.role || "buyer"
      };

      setUser(profile);
      localStorage.setItem("pp_user", JSON.stringify(profile));

      await syncFavoritesWithDb();
      
      if (authReason === "chat") {
        setIsChatOpen(true);
        setChatMode("human");
      }
      closeAuthModal(); // Close modal if open on success
    } catch (error) {
      console.error("Failed to parse Google OAuth credential:", error);
    }
  };

  const mockLogin = async (role: "admin" | "user") => {
    const email = role === "admin" ? "admin@propertyparadise.com" : "customer@example.com";
    const name = role === "admin" ? "Mock Admin" : "Mock Customer";
    const picture = role === "admin" 
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";

    const dbProfile = await syncAuthSession(email, name);

    const profile: UserProfile = {
      name: dbProfile?.name || name,
      email: dbProfile?.email || email,
      picture: picture,
      googleId: "mock-id-12345",
      isMock: true,
      role: dbProfile?.role || (role === "admin" ? "admin" : "buyer")
    };

    setUser(profile);
    localStorage.setItem("pp_user", JSON.stringify(profile));

    await syncFavoritesWithDb();
    
    if (authReason === "chat") {
      setIsChatOpen(true);
      setChatMode("human");
    }
    closeAuthModal(); // Close modal if open on success
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pp_user");
    localStorage.removeItem("pp_favorites");
  };

  const isAdmin = user ? user.role === "admin" : false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      mockLogin, 
      logout, 
      isAdmin,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      authReason,
      isChatOpen,
      setIsChatOpen,
      chatMode,
      setChatMode,
      theme,
      toggleTheme
    }}>
      {children}
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} reason={authReason} />}
    </AuthContext.Provider>
  );
};
