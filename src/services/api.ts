import { API_BASE_URL, ORIGIN_CODE, TOKEN } from '../config/environment';

// Tipos para as respostas da API
export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  dados: {
    token: string;
    login: string;
    [key: string]: any;
  };
}

export interface FirstAccessResponse {
  dados: boolean;
}

export interface CreatePasswordRequest {
  emailOuNomeLogin: string;
  senha: string;
}

// Classe principal da API
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Origin-Code': ORIGIN_CODE,
      'Token': TOKEN,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('login/efetuar', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async checkFirstAccess(login: string): Promise<FirstAccessResponse> {
    return this.request<FirstAccessResponse>(`login/ehPrimeiroAcesso/${login}`, {
      method: 'GET',
    });
  }

  async createPassword(data: CreatePasswordRequest): Promise<any> {
    return this.request('usuarios/cadastrarPrimeiraSenha', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
