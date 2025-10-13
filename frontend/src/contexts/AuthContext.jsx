import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginUser, 
  logoutUser, 
  registerStudent, 
  registerTeacher, 
  registerParent,
  getCurrentUser,
  onAuthStateChange 
} from '../../../backend';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch complete user data from Firestore
          const userData = await getCurrentUser();
          
          // Flatten the structure for easier access
          const flattenedUser = {
            id: userData.userId,
            userId: userData.userId,
            email: userData.email,
            role: userData.role,
            fullName: userData.fullName,
            // Flatten nested userData fields for direct access
            ...(userData.userData?.studentData || {}),
            ...(userData.userData?.teacherData || {}),
            ...(userData.userData?.parentData || {}),
            // Ensure className is set (override if needed)
            className: userData.userData?.studentData?.className || userData.userData?.studentData?.class || undefined,
            // Keep the original nested structure as well
            userData: userData.userData
          };
          
          setUser(flattenedUser);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginUser(email, password);
      
      // Flatten the structure for easier access
      const flattenedUser = {
        id: response.userId,
        userId: response.userId,
        email: response.email,
        role: response.role,
        fullName: response.fullName,
        // Flatten nested userData fields for direct access
        ...(response.userData?.studentData || {}),
        ...(response.userData?.teacherData || {}),
        ...(response.userData?.parentData || {}),
        // Ensure className is set (override if needed)
        className: response.userData?.studentData?.className || response.userData?.studentData?.class || undefined,
        // Keep the original nested structure as well
        userData: response.userData
      };
      
      console.log('Login - Flattened user:', flattenedUser);
      console.log('Login - className:', flattenedUser.className);
      
      setUser(flattenedUser);
      return flattenedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register Student
  const register = async (userData, role = 'student') => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (role) {
        case 'student':
          response = await registerStudent(userData);
          break;
        case 'teacher':
          response = await registerTeacher(userData);
          break;
        case 'parent':
          response = await registerParent(userData);
          break;
        default:
          throw new Error('Invalid role');
      }
      
      // Flatten the structure for easier access
      const flattenedUser = {
        id: response.userId,
        userId: response.userId,
        email: response.userData.email,
        role: response.userData.role,
        fullName: response.userData.fullName,
        // Flatten nested userData fields for direct access
        ...(response.userData?.studentData || {}),
        ...(response.userData?.teacherData || {}),
        ...(response.userData?.parentData || {}),
        // Ensure className is set (override if needed)
        className: response.userData?.studentData?.className || response.userData?.studentData?.class || undefined,
        // Keep the original nested structure as well
        userData: response.userData
      };
      
      console.log('Register - Flattened user:', flattenedUser);
      console.log('Register - className:', flattenedUser.className);
      
      setUser(flattenedUser);
      return flattenedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher',
    isParent: user?.role === 'parent',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
