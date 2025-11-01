import { useEffect, useState } from "react";
import { authService, type AuthState } from "../services/auth";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const login = async (credentials: { login: string; senha: string }) => {
    return authService.login(credentials);
  };

  const logout = async () => {
    return authService.logout();
  };

  const checkFirstAccess = async (login: string) => {
    return authService.checkFirstAccess(login);
  };

  const createPassword = async (emailOuNomeLogin: string, senha: string) => {
    return authService.createPassword(emailOuNomeLogin, senha);
  };

  return {
    ...authState,
    login,
    logout,
    checkFirstAccess,
    createPassword,
  };
};
