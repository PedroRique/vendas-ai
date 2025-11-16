import { useEffect, useState, useMemo } from 'react';
import { authService, type AuthState } from '../services/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(
    authService.getState()
  );

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const login = async (credentials: {
    loginName: string;
    password: string;
  }) => {
    return authService.login(credentials);
  };

  const logout = async () => {
    return authService.logout();
  };

  const checkFirstAccess = async (loginName: string) => {
    return authService.checkFirstAccess(loginName);
  };

  const createPassword = async (loginName: string, password: string) => {
    return authService.createPassword(loginName, password);
  };

  const isAdmin = useMemo(() => {
    return authService.isAdmin();
  }, [authState.user]);

  return {
    ...authState,
    login,
    logout,
    checkFirstAccess,
    createPassword,
    isAdmin,
  };
};
