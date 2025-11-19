import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginUser, 
  logoutUser, 
  registerStudent, 
  registerTeacher, 
  registerParent,
  getCurrentUser,
  onAuthStateChange 
} from '../services/authService';

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
    // Check for hardcoded admin in localStorage first
    const hardcodedAdmin = localStorage.getItem('hardcodedAdmin');
    if (hardcodedAdmin) {
      try {
        const adminData = JSON.parse(hardcodedAdmin);
        console.log('Restoring hardcoded admin from localStorage:', adminData);
        setUser(adminData);
        setLoading(false);
        return; // Don't set up Firebase listener for hardcoded admin
      } catch (err) {
        console.error('Error parsing hardcoded admin from localStorage:', err);
        localStorage.removeItem('hardcodedAdmin');
      }
    }

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
            title: userData.title,
            // Flatten nested userData fields for direct access
            ...(userData.userData?.studentData || {}),
            ...(userData.userData?.teacherData || {}),
            ...(userData.userData?.parentData || {}),
            // Ensure className is set for students (override if needed)
            className: userData.userData?.studentData?.className || userData.userData?.studentData?.class || undefined,
            // Also set class field for backward compatibility
            class: userData.userData?.studentData?.className || userData.userData?.studentData?.class || undefined,
            // Ensure teacher-specific fields are accessible
            subjects: userData.subjects || userData.userData?.teacherData?.subjects || [],
            classes: userData.classes || userData.userData?.teacherData?.teachingClasses || [],
            teacherIndex: userData.teacherIndex || userData.userData?.teacherData?.teacherIndex || undefined,
            // Ensure parent-specific fields are accessible
            children: userData.children || userData.userData?.parentData?.children || [],
            // Keep the original nested structure as well
            userData: userData.userData
          };
          
          console.log('AuthContext - Flattened user:', {
            id: flattenedUser.id,
            role: flattenedUser.role,
            grade: flattenedUser.grade,
            className: flattenedUser.className,
            class: flattenedUser.class,
            children: flattenedUser.children,
            studentData: userData.userData?.studentData
          });
          
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
        title: response.title,
        // Check if this is the hardcoded admin
        isHardcodedAdmin: response.userData?.isHardcodedAdmin || false,
        // Flatten nested userData fields for direct access
        ...(response.userData?.studentData || {}),
        ...(response.userData?.teacherData || {}),
        ...(response.userData?.parentData || {}),
        // Ensure className is set for students (override if needed)
        className: response.userData?.studentData?.className || response.userData?.studentData?.class || undefined,
        // Also set class field for backward compatibility
        class: response.userData?.studentData?.className || response.userData?.studentData?.class || undefined,
        // Ensure teacher-specific fields are accessible
        subjects: response.subjects || response.userData?.teacherData?.subjects || [],
        classes: response.classes || response.userData?.teacherData?.teachingClasses || [],
        teacherIndex: response.teacherIndex || response.userData?.teacherData?.teacherIndex || undefined,
        // Ensure parent-specific fields are accessible
        children: response.children || response.userData?.parentData?.children || [],
        // Keep the original nested structure as well
        userData: response.userData
      };
      
      console.log('Login - Flattened user:', {
        id: flattenedUser.id,
        role: flattenedUser.role,
        isHardcodedAdmin: flattenedUser.isHardcodedAdmin,
        grade: flattenedUser.grade,
        className: flattenedUser.className,
        class: flattenedUser.class,
        children: flattenedUser.children
      });
      
      // Store hardcoded admin in localStorage to persist across refreshes
      if (flattenedUser.isHardcodedAdmin) {
        localStorage.setItem('hardcodedAdmin', JSON.stringify(flattenedUser));
      }
      
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
      
      // Check if this is hardcoded admin
      if (user?.isHardcodedAdmin) {
        console.log('Logging out hardcoded admin');
        localStorage.removeItem('hardcodedAdmin');
        setUser(null);
      } else {
        // Regular Firebase logout
        await logoutUser();
        setUser(null);
      }
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
        title: response.userData.title,
        // Flatten nested userData fields for direct access
        ...(response.userData?.studentData || {}),
        ...(response.userData?.teacherData || {}),
        ...(response.userData?.parentData || {}),
        // Ensure className is set for students (override if needed)
        className: response.userData?.studentData?.className || response.userData?.studentData?.class || undefined,
        // Ensure teacher-specific fields are accessible
        subjects: response.userData.subjects || response.userData?.teacherData?.subjects || [],
        classes: response.userData.classes || response.userData?.teacherData?.teachingClasses || [],
        teacherIndex: response.userData.teacherIndex || response.userData?.teacherData?.teacherIndex || undefined,
        // Ensure parent-specific fields are accessible
        children: response.userData.children || response.userData?.parentData?.children || [],
        // Keep the original nested structure as well
        userData: response.userData
      };
      
      console.log('Register - User registered successfully:', flattenedUser.email);
      
      // Don't set user - require manual login
      // This ensures proper authentication flow
      // setUser(flattenedUser);
      
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
