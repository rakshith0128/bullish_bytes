
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
}

// Sample users for demo purposes
const sampleUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@finsight.com",
    password: "password123",
    avatar: "",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage in this demo)
    const storedUser = localStorage.getItem("finsight-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // In a real app, this would be an API call
    const foundUser = sampleUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("finsight-user", JSON.stringify(userWithoutPassword));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);

    // Check if email already exists
    const existingUser = sampleUsers.find((u) => u.email === email);
    if (existingUser) {
      setLoading(false);
      return false;
    }

    // In a real app, this would be an API call to create a user
    const newUser = {
      id: String(sampleUsers.length + 1),
      name,
      email,
      password,
      avatar: "",
    };

    sampleUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("finsight-user", JSON.stringify(userWithoutPassword));
    
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("finsight-user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
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
