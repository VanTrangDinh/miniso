import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSnackbar } from '../components/GlobalSnackbarProvider';

// Định nghĩa kiểu User
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  birthday?: string;
  address?: string;
}

// Định nghĩa trạng thái và chức năng của AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUserInfo: (userData: Partial<User>) => Promise<void>;
}

// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    // Kiểm tra localStorage khi component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Gọi API đăng nhập ở đây
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập dữ liệu user
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: email,
        avatar: 'https://via.placeholder.com/150',
        phone: '',
        birthday: '',
        address: '',
      };

      // Lưu user vào localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      showSuccess('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login error:', error);
      showError('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // TODO: Gọi API đăng ký ở đây
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập dữ liệu user
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        avatar: 'https://via.placeholder.com/150',
        phone: '',
        birthday: '',
        address: '',
      };

      // Lưu user vào localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      showSuccess('Đăng ký thành công!');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      showError('Đăng ký thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      // TODO: Gọi API cập nhật thông tin user
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showSuccess('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      console.error('Update user info error:', error);
      showError('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Xóa user khỏi localStorage
    localStorage.removeItem('user');
    setUser(null);
    showSuccess('Đã đăng xuất');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 