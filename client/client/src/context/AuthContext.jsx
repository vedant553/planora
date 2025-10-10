import { createContext, useContext, useState } from 'react';
import { mockCurrentUser } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockCurrentUser);
  const [token, setToken] = useState('mock-token-123');

  const login = async (email, password) => {
    // Mock login - in real app, this would call an API
    setUser(mockCurrentUser);
    setToken('mock-token-123');
    return { user: mockCurrentUser, token: 'mock-token-123' };
  };

  const signup = async (email, password, name) => {
    // Mock signup - in real app, this would call an API
    const newUser = { ...mockCurrentUser, email, name };
    setUser(newUser);
    setToken('mock-token-123');
    return { user: newUser, token: 'mock-token-123' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};