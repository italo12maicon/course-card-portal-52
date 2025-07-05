
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para obter IP do usuário (simulada)
  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "IP não disponível";
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login - em um app real, seria uma chamada à API
    if (email && password) {
      const userIP = await getUserIP();
      const mockUser: User = {
        id: 1,
        name: "Usuário Teste",
        email: email,
        isActive: true,
        registrationDate: new Date().toISOString().split('T')[0],
        accessibleCourses: [1, 2],
        ipAddress: userIP,
        lastLogin: new Date().toISOString(),
        loginCount: 1
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Notificar admin sobre novo login
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const existingUserIndex = adminUsers.findIndex((u: User) => u.email === email);
      
      if (existingUserIndex >= 0) {
        adminUsers[existingUserIndex] = { 
          ...adminUsers[existingUserIndex], 
          lastLogin: mockUser.lastLogin,
          ipAddress: mockUser.ipAddress,
          loginCount: (adminUsers[existingUserIndex].loginCount || 0) + 1
        };
      } else {
        adminUsers.push(mockUser);
      }
      
      localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (name && email && password) {
      const userIP = await getUserIP();
      const newUser: User = {
        id: Date.now(),
        name,
        email,
        isActive: true,
        registrationDate: new Date().toISOString().split('T')[0],
        accessibleCourses: [],
        ipAddress: userIP,
        lastLogin: new Date().toISOString(),
        loginCount: 1
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Adicionar à lista de usuários do admin
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      adminUsers.push(newUser);
      localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
