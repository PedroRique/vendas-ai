import { apiService, type LoginRequest, type LoginResponse } from './api';

export interface User {
  token: string;
  login: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private user: User | null = null;
  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    // Verifica se há um usuário salvo no localStorage
    this.loadUserFromStorage();
  }

  // Gerenciamento de estado
  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthState {
    return {
      user: this.user,
      isAuthenticated: !!this.user,
      isLoading: false,
      error: null,
    };
  }

  // Persistência
  private saveUserToStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadUserFromStorage() {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearUser();
    }
  }

  private clearUser() {
    this.user = null;
    localStorage.removeItem('user');
    this.notifyListeners();
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<void> {
    try {
      const response: LoginResponse = await apiService.login(credentials);
      
      if (response.dados && response.dados.token) {
        this.user = {
          ...response.dados,
          login: credentials.login,
        };
        this.saveUserToStorage(this.user);
        this.notifyListeners();
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      this.clearUser();
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.clearUser();
  }

  async checkFirstAccess(login: string): Promise<boolean> {
    try {
      const response = await apiService.checkFirstAccess(login);
      return response.dados;
    } catch (error) {
      console.error('Error checking first access:', error);
      return false;
    }
  }

  async createPassword(emailOuNomeLogin: string, senha: string): Promise<void> {
    await apiService.createPassword({ emailOuNomeLogin, senha });
  }

  // Getters
  getToken(): string | null {
    return this.user?.token || null;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }
}

export const authService = new AuthService();
export default authService;
