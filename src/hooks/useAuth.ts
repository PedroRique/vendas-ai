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

  const isAdmin = (): boolean => {
    const user = authState.user;
    if (!user) return false;
    
    // ProfileEnum.ADMIN = 1 (baseado no sistema antigo)
    if ('tipoUsuario' in user && typeof user.tipoUsuario === 'object' && user.tipoUsuario !== null) {
      const tipoUsuario = user.tipoUsuario as { tipoUsuarioId?: number; [key: string]: unknown };
      return tipoUsuario.tipoUsuarioId === 1;
    }
    
    return false;
  };

  return {
    ...authState,
    login,
    logout,
    checkFirstAccess,
    createPassword,
    isAdmin: isAdmin(),
  };
};
