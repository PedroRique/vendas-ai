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
    // Carregar de forma síncrona primeiro, depois atualizar role se necessário
    this.loadUserFromStorageSync();
    // Atualizar role de forma assíncrona se necessário
    this.updateUserRoleIfNeeded();
  }
  
  private loadUserFromStorageSync() {
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
  
  private async updateUserRoleIfNeeded() {
    // Se o usuário não tem role ou tem role padrão, tentar buscar do servidor
    if (this.user && this.user.id && (!this.user.role || this.user.role === 'operator')) {
      try {
        const userInfo = await apiService.getUser(this.user.id);
        if (userInfo.user?.role) {
          this.user.role = userInfo.user.role;
          this.saveUserToStorage(this.user);
          this.notifyListeners();
        }
      } catch (error) {
        console.warn('Não foi possível atualizar role do usuário:', error);
        // Continua com o role existente ou padrão
        if (!this.user.role) {
          this.user.role = 'operator';
        }
      }
    }
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
        // Criar usuário temporário e salvar token no localStorage ANTES de buscar o role
        // Isso garante que o token esteja disponível para a requisição getUser
        const tempUser: User = {
          id: response.id,
          loginName: response.loginName || credentials.loginName,
          name: response.name || '',
          surname: response.surname || '',
          email: response.email || '',
          token: response.token,
          hoursUntilTokenExpired: response.hoursUntilTokenExpired,
          role: 'operator', // Valor temporário, será atualizado abaixo
        };
        // Salvar token no localStorage antes de fazer a requisição
        this.saveUserToStorage(tempUser);

        // Buscar informações completas do usuário para obter o role
        let userRole = 'operator'; // Valor padrão
        try {
          const userInfo = await apiService.getUser(response.id);
          if (userInfo.user?.role) {
            userRole = userInfo.user.role;
          }
        } catch (error) {
          console.warn('Não foi possível buscar role do usuário, usando padrão:', error);
          // Continua com role padrão se não conseguir buscar
        }

        // Atualizar usuário com o role correto
        this.user = {
          ...tempUser,
          role: userRole,
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
    console.log('isAdmin', this.user?.role);
    return this.user?.role === 'administrator';
  }
}

export const authService = new AuthService();
export default authService;
