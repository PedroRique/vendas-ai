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
    
    // Get token from auth service if available
    const authToken = localStorage.getItem('user');
    let userToken = null;
    if (authToken) {
      try {
        const user = JSON.parse(authToken);
        userToken = user.token;
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Origin-Code': ORIGIN_CODE,
      'Token': TOKEN,
    };

    // Add user token if available
    if (userToken) {
      defaultHeaders['Authorization'] = `Bearer ${userToken}`;
    }

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

  // Métodos de localização
  async getPartners(tipoTarifa: string = ''): Promise<PartnersResponse> {
    const endpoint = tipoTarifa ? `tarifas/${tipoTarifa}` : 'tarifas/';
    return this.request<PartnersResponse>(endpoint, {
      method: 'GET',
    });
  }

  async getLocations(data: GetLocationsRequest): Promise<LocationsResponse> {
    return this.request<LocationsResponse>('localidades/obter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyAvailableCars(codigoAgencia: number, data: VerifyAvailableCarsRequest): Promise<AvailableCarsResponse> {
    return this.request<AvailableCarsResponse>(`agencias/${codigoAgencia}/lojas/veiculos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Tipos para localização
export interface Partner {
  codigo: string;
  descricao: string;
  categoria: string;
}

export interface PartnersResponse {
  dados: Partner[];
}

export interface GetLocationsRequest {
  filtro: string;
  codAgencia: number;
  parceria?: string;
}

export interface Location {
  nome: string;
  sigla?: string;
  lojas?: string[];
  qtLojas: number;
}

export interface LocationsResponse {
  dados: {
    Aeroportos: Location[];
    TodasLojas: Location[];
    Cidades: Location[];
    Bairro: Location[];
  };
}

export interface VerifyAvailableCarsRequest {
  codCupom?: string;
  dataHoraDevolucao: string;
  dataHoraRetirada: string;
  devolverNoMesmoLocalRetirada: boolean;
  locaisDevolucao: string[];
  locaisRetirada: string[];
  protocolo?: string;
  franquiaKM?: Partner;
  tarifas: Partner[];
  parceria?: Partner;
}

export interface AvailableCarsResponse {
  dados: {
    filtroCupom?: {
      valido: boolean;
    };
    veiculosDisponiveis: any[];
    [key: string]: any;
  };
}

export const apiService = new ApiService();
export default apiService;
