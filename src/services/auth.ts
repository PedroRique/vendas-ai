import {
  apiService,
  type LoginRequest,
  type LoginResponse,
  type CreatePasswordRequest,
} from './api';

export interface User {
  id: number;
  loginName: string;
  name: string;
  surname: string;
  email: string;
  token: string;
  hoursUntilTokenExpired: number;
  role?: string;
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
    this.listeners.forEach((listener) => listener(state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
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

      // Verificar se há erros na resposta
      if (response.errors && response.errors.length > 0) {
        const errorMessage =
          response.errors[0]?.message || 'Erro ao fazer login';
        throw new Error(errorMessage);
      }

      // Verificar se o login foi bem-sucedido
      if (response.token && response.id) {
        this.user = {
          id: response.id,
          loginName: response.loginName || credentials.loginName,
          name: response.name || '',
          surname: response.surname || '',
          email: response.email || '',
          token: response.token,
          hoursUntilTokenExpired: response.hoursUntilTokenExpired,
          role: response.role || 'operator',
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

  async checkFirstAccess(loginName: string): Promise<boolean> {
    try {
      const response = await apiService.checkFirstAccess(loginName);
      
      // Verificar se há erros
      if (response.errors && response.errors.length > 0) {
        console.error('Error checking first access:', response.errors);
        return false;
      }
      
      return response.isFirstAccess;
    } catch (error) {
      console.error('Error checking first access:', error);
      return false;
    }
  }

  async createPassword(
    loginName: string,
    password: string
  ): Promise<void> {
    const data: CreatePasswordRequest = {
      loginName,
      password,
    };
    
    const response = await apiService.createPassword(data);
    
    // Verificar se há erros
    if (response.errors && response.errors.length > 0) {
      const errorMessage =
        response.errors[0]?.message || 'Erro ao criar senha';
      throw new Error(errorMessage);
    }
    
    if (!response.success) {
      throw new Error('Falha ao criar senha');
    }
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

  isAdmin(): boolean {
    return this.user?.role === 'administrator';
  }
}

export const authService = new AuthService();
export default authService;
