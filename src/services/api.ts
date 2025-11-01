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

export interface StartAttendanceRequest {
  codigoAgencia: number;
  tokenAtendimento?: string;
}

export interface StartAttendanceResponse {
  dados: number; // id_attendance (protocolo)
}

// Tipos para reserva (precisam estar antes da classe para evitar problemas de exportação)
export interface BookingRequest {
  dataHoraDevolucao: string;
  dataHoraRetirada: string;
  localRetirada: string;
  localDevolucao: string;
  ehMensal?: boolean;
  dadosCliente: {
    email: string;
    prefixoNome: string;
    nome: string;
    sobrenome: string;
    dddTelefone: string;
    telefone: string;
    dddCelular: string;
    Celular: string;
    tipoDocumento: number;
    documento: string;
  };
  codigoAcriss?: string;
  categoria?: string;
  opcionais?: Array<Record<string, unknown>>;
  protecoes?: Array<Record<string, unknown>>;
  codigoPromocional?: string;
  tarifas?: Array<Record<string, unknown>>;
  rateQualifier?: string;
  tokenCotacao?: string;
  protocolo: string;
  codigoReservaAgencia?: string;
  [key: string]: unknown;
}

export interface BookingResponse {
  dados: {
    reserva: Record<string, unknown>;
    totalbasicoReserva: Record<string, unknown>;
    [key: string]: unknown;
  };
  protocolo: string;
  [key: string]: unknown;
}

export interface QuotationRequest {
  dataHoraDevolucao: string;
  dataHoraRetirada: string;
  localRetirada: string;
  localDevolucao: string;
  ehMensal?: boolean;
  dadosCliente: {
    email: string;
    prefixoNome: string;
    nome: string;
    sobrenome: string;
    dddTelefone: string;
    telefone: string;
    dddCelular: string;
    Celular: string;
    tipoDocumento: number;
    documento: string;
  };
  codigoAcriss?: string;
  categoria?: string;
  opcionais?: Array<Record<string, unknown>>;
  protecoes?: Array<Record<string, unknown>>;
  codigoPromocional?: string;
  codCupom?: string;
  tarifas?: Array<Record<string, unknown>>;
  rateQualifier?: string;
  tokenCotacao?: string;
  protocolo: string;
  locaisRetirada?: string[];
  locaisDevolucao?: string[];
  [key: string]: unknown;
}

export interface QuotationResponse {
  dados: unknown;
  [key: string]: unknown;
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
    
    // Get token and user info from auth service if available
    const authToken = localStorage.getItem('user');
    let userToken = null;
    let userLogin = null;
    if (authToken) {
      try {
        const user = JSON.parse(authToken);
        userToken = user.token;
        userLogin = user.login;
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

    // Add CD-Login header if user is logged in (como no sistema antigo)
    if (userLogin) {
      defaultHeaders['CD-Login'] = userLogin;
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

  // Métodos de atendimento
  async startAttendance(data: StartAttendanceRequest): Promise<StartAttendanceResponse> {
    return this.request<StartAttendanceResponse>('atendimentos/iniciar', {
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

  // Métodos de clientes
  async findCustomer(documento: string): Promise<FindCustomerResponse> {
    return this.request<FindCustomerResponse>(`clientes/${documento}`, {
      method: 'GET',
    });
  }

  async saveCustomer(data: SaveCustomerRequest): Promise<SaveCustomerResponse> {
    return this.request<SaveCustomerResponse>('clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async editCustomer(clienteId: number, data: EditCustomerRequest): Promise<EditCustomerResponse> {
    return this.request<EditCustomerResponse>(`clientes/${clienteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Métodos de reserva
  async booking(idCarrental: number, data: BookingRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>(`agencias/${idCarrental}/reservas`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async quotation(idCarrental: number, data: QuotationRequest): Promise<QuotationResponse> {
    return this.request<QuotationResponse>(`agencias/${idCarrental}/lojas/veiculos`, {
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
  codAgencia?: number;
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
  protocolo: string;
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

// Tipos para clientes
export interface FindCustomerResponse {
  dados: {
    clienteId: number;
    nomeCompleto: string;
    email: string;
    telefone: string;
    documento: string;
    tipoDocumentoId: number;
    [key: string]: unknown;
  };
}

export interface SaveCustomerRequest {
  nomeCompleto: string;
  email: string;
  telefone: string;
  documento: string;
  tipoDocumentoId: number;
}

export interface SaveCustomerResponse {
  dados: {
    clienteId: number;
    [key: string]: unknown;
  };
}

export interface EditCustomerRequest {
  nomeCompleto: string;
  email: string;
  telefone: string;
  documento: string;
  tipoDocumentoId: number;
}

export interface EditCustomerResponse {
  dados: unknown;
}

// Enum de tipos de documento (convertido para const para compatibilidade com erasableSyntaxOnly)
export const DocumentTypesEnum = {
  CPF: 1,
  CNPJ: 2,
  PASSAPORT: 3,
} as const;

export type DocumentTypesEnumValue = typeof DocumentTypesEnum[keyof typeof DocumentTypesEnum];

export const apiService = new ApiService();
export default apiService;
