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

  async getAvailableAgencies(): Promise<AvailableAgenciesResponse> {
    return this.request<AvailableAgenciesResponse>('agencia/consultar/agencias/disponiveis', {
      method: 'GET',
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

  // Métodos de reservas
  async listBookings(idCarrental: number, document: string): Promise<ListBookingsResponse> {
    return this.request<ListBookingsResponse>(`agencias/${idCarrental}/reservas?key=${document}`, {
      method: 'GET',
    });
  }

  async editBooking(idCarrental: number, codeBooking: string, data: EditBookingRequest): Promise<EditBookingResponse> {
    return this.request<EditBookingResponse>(`agencias/${idCarrental}/reservas/${codeBooking}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(idCarrental: number, data: CancelBookingRequest): Promise<CancelBookingResponse> {
    return this.request<CancelBookingResponse>(`agencias/${idCarrental}/reservas/cancelar`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVoucher(codeBooking: string): Promise<ResendVoucherResponse> {
    return this.request<ResendVoucherResponse>(`agencias/100/reserva/reenviarVoucher/${codeBooking}`, {
      method: 'POST',
    });
  }

  async getCancellationReasons(): Promise<CancellationReasonsResponse> {
    return this.request<CancellationReasonsResponse>('motivosCancelamento', {
      method: 'GET',
    });
  }

  async getLogFile(reservationCode: string): Promise<Blob> {
    const url = `${this.baseURL}logs/${reservationCode}`;
    
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
      'Origin-Code': ORIGIN_CODE,
      'Token': TOKEN,
    };

    if (userToken) {
      defaultHeaders['Authorization'] = `Bearer ${userToken}`;
    }

    if (userLogin) {
      defaultHeaders['CD-Login'] = userLogin;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // Métodos de gestão de usuários (área administrativa)
  async getUsers(params?: {
    key?: string;
    page?: number;
    qtPorPagina?: number;
  }): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.key) queryParams.append('Key', params.key);
    queryParams.append('TipoUsuarioId', '0');
    queryParams.append('pagina', String(params?.page || 1));
    queryParams.append('qtPorPagina', String(params?.qtPorPagina || 10));
    queryParams.append('Ordenacao', 'idDesc');

    return this.request<UsersListResponse>(`usuarios/?${queryParams.toString()}`, {
      method: 'GET',
    });
  }

  async getProfiles(): Promise<ProfilesResponse> {
    return this.request<ProfilesResponse>('usuarios/tipos', {
      method: 'GET',
    });
  }

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    return this.request<CreateUserResponse>('usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.request<UpdateUserResponse>(`usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(userId: number): Promise<ResetPasswordResponse> {
    return this.request<ResetPasswordResponse>(`usuarios/${userId}/resetarSenha`, {
      method: 'POST',
      body: JSON.stringify({}),
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
  locadoras?: string[];
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
  locadoras?: string[];
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

export interface Agency {
  codigo: number;
  nome: string;
  nomeAgencia?: string;
  [key: string]: unknown;
}

export interface AvailableAgenciesResponse {
  dados: Agency[];
}

// Tipos para reservas
export interface Booking {
  reservaId: number;
  codigoReserva: string;
  codigoReservaAgencia?: string;
  dataRetirada: string;
  dataDevolucao: string;
  statusReserva: {
    nome: string;
    [key: string]: unknown;
  };
  grupoVeiculo: string;
  lojaRetirada: {
    nome: string;
    agencia: {
      codAgencia: number;
      nome: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  lojaDevolucao: {
    nome: string;
    [key: string]: unknown;
  };
  valorTotalApurado: number;
  valorPorDia?: number;
  valorCaucao?: number;
  valorFranquia?: number;
  codigoPromocional?: string;
  opcionais?: Array<{ nome: string; [key: string]: unknown }>;
  protecao?: string;
  cliente?: {
    nomeCompleto?: string;
    name?: string;
    email: string;
    tel?: string;
    ddd?: string;
    telefone?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ListBookingsResponse {
  dados: Booking[];
}

export interface EditBookingRequest {
  dataHoraDevolucao?: string;
  dataHoraRetirada?: string;
  localRetirada?: string;
  localDevolucao?: string;
  [key: string]: unknown;
}

export interface EditBookingResponse {
  dados: unknown;
}

export interface CancelBookingRequest {
  codigoReserva: string;
  motivoCancelamento: string;
  [key: string]: unknown;
}

export interface CancelBookingResponse {
  dados: unknown;
}

export interface ResendVoucherResponse {
  dados: unknown;
}

export interface CancellationReason {
  codigo: string;
  descricao: string;
  [key: string]: unknown;
}

export interface CancellationReasonsResponse {
  dados: CancellationReason[];
}

// Tipos para gestão de usuários
export interface AdminUser {
  usuarioId: number;
  nome: string;
  sobrenome?: string;
  email: string;
  nomeLogin: string;
  ativo: boolean;
  acessado?: boolean;
  tipoUsuario: {
    tipoUsuarioId: number;
    nome: string;
    [key: string]: unknown;
  };
  tipoAtuacao?: {
    tipoAtuacaoId: number;
    nome: string;
    descricao: string;
    [key: string]: unknown;
  };
  tipoAtuacaoId?: number;
  [key: string]: unknown;
}

export interface UsersListResponse {
  dados: {
    Itens: AdminUser[];
    PaginaAtual: number;
    TotalItens: number;
    [key: string]: unknown;
  };
}

export interface Profile {
  tipoUsuarioId: number;
  nome: string;
  [key: string]: unknown;
}

export interface ProfilesResponse {
  dados: Profile[];
}

export interface CreateUserRequest {
  nome: string;
  sobrenome: string;
  email: string;
  nomeLogin: string;
  tipoUsuarioId: number;
  tipoAtuacaoId: number;
  ativo: boolean;
  [key: string]: unknown;
}

export interface CreateUserResponse {
  dados: AdminUser;
}

export interface UpdateUserRequest {
  nome: string;
  sobrenome?: string;
  email: string;
  tipoUsuarioId?: number;
  tipoAtuacaoId?: number;
  ativo?: boolean;
  [key: string]: unknown;
}

export interface UpdateUserResponse {
  dados: AdminUser;
}

export interface ResetPasswordResponse {
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
