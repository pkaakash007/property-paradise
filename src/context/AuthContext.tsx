import React, { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { 
  syncAuthSession, 
  syncFavoritesWithDb, 
  loginUser, 
  registerUser, 
  verifyOtp 
} from "../lib/api";

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
  loginWithCredentials: (email: string, password?: string) => Promise<any>;
  registerWithCredentials: (username: string, email: string, password?: string) => Promise<any>;
  verifyCredentialOtp: (email: string, code: string) => Promise<void>;
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
    } catch (error) {
      console.error("Failed to parse Google OAuth credential:", error);
    }
  };

  const loginWithCredentials = async (email: string, password?: string): Promise<any> => {
    const dbUser = await loginUser(email, password);
    
    const profile: UserProfile = {
      name: dbUser.name,
      email: dbUser.email,
      picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80", // Default avatar
      googleId: "local-" + dbUser.id,
      isMock: false,
      role: dbUser.role
    };

    setUser(profile);
    localStorage.setItem("pp_user", JSON.stringify(profile));
    
    await syncFavoritesWithDb();
    return dbUser;
  };

  const registerWithCredentials = async (username: string, email: string, password?: string): Promise<any> => {
    return await registerUser(username, email, password);
  };

  const verifyCredentialOtp = async (email: string, code: string) => {
    const dbUser = await verifyOtp(email, code);
    
    const profile: UserProfile = {
      name: dbUser.name,
      email: dbUser.email,
      picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      googleId: "local-" + dbUser.id,
      isMock: false,
      role: dbUser.role
    };

    setUser(profile);
    localStorage.setItem("pp_user", JSON.stringify(profile));
    
    await syncFavoritesWithDb();
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
      loginWithCredentials,
      registerWithCredentials,
      verifyCredentialOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
