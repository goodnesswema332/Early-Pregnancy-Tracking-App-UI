import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

interface User {
  _id: string;
  name: string;
  email?: string;
  anonymous?: boolean;
  progress?: {
    modulesCompleted?: number;
    totalModules?: number;
    badgesEarned?: string[];
    streak?: number;
    lastActive?: Date | string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  becomeAnonymous: () => Promise<void>;
  editProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        setUser(JSON.parse(userData));
        return;
      }

      // No server auth found -> ensure there's an anonymous user persisted locally
      const anon = await AsyncStorage.getItem("anonymousUser");
      if (anon) {
        setUser(JSON.parse(anon));
        return;
      }

      await becomeAnonymous();
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...userData } = response.data.data;

      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, ...userData } = response.data.data;

      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const becomeAnonymous = async () => {
    const id = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const anonUser: User = {
      _id: id,
      name: "Guest",
      anonymous: true,
      progress: {
        modulesCompleted: 0,
        totalModules: 0,
        badgesEarned: [],
        streak: 0,
        lastActive: new Date().toISOString(),
      },
    };
    await AsyncStorage.setItem("anonymousUser", JSON.stringify(anonUser));
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userData");
    setUser(anonUser);
  };

  const editProfile = async (updates: Partial<User>) => {
    try {
      const next = { ...(user || {}), ...updates } as User;
      if (next.anonymous) {
        await AsyncStorage.setItem("anonymousUser", JSON.stringify(next));
      } else {
        await AsyncStorage.setItem("userData", JSON.stringify(next));
      }
      setUser(next);
    } catch (_err) {
      console.error("Error editing profile", _err);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      // create a fresh anonymous user on logout
      await becomeAnonymous();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        becomeAnonymous,
        editProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
