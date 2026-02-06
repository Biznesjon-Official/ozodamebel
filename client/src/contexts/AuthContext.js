import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGIN_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiService.login(credentials);
      
      if (response.success) {
        // Show success message first
        toast.success('Tizimga muvaffaqiyatli kirdingiz');
        
        // Add a small delay before setting user to show loader transition
        setTimeout(() => {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user: response.user, token: response.token }
          });
        }, 1500);
        
        return { success: true };
      } else {
        const message = response.message || 'Login xatoligi';
        dispatch({ type: 'LOGIN_FAIL', payload: message });
        toast.error(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = error.message || 'Login xatoligi';
      dispatch({ type: 'LOGIN_FAIL', payload: message });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Mock logout
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch({ type: 'LOGOUT' });
    toast.info('Tizimdan chiqdingiz');
  };

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            dispatch({ type: 'LOAD_USER', payload: response.user });
          } else {
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Load user error:', error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // Add a small delay to show the loader
        setTimeout(() => {
          dispatch({ type: 'SET_LOADING', payload: false });
        }, 1000);
      }
    };

    loadUser();
  }, [state.token]);

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await apiService.updateProfile(profileData);
      if (response.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.user });
        return { success: true };
      } else {
        throw new Error(response.message || 'Profil yangilanmadi');
      }
    } catch (error) {
      throw new Error(error.message || 'Profil yangilanmadi');
    }
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  }
  return context;
};