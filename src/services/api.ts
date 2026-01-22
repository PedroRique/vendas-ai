import { API_BASE_URL } from '../config/environment';
import { authService } from './auth';

// ==================== TIPOS DE AUTENTICAÇÃO ====================

export interface LoginRequest {
  loginName: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  loginName: string | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  token: string | null;
  hoursUntilTokenExpired: number;
  errors: ApiError[] | null;
}

export interface FirstAccessResponse {
  isFirstAccess: boolean;
  errors: ApiError[] | null;
}

export interface CreatePasswordRequest {
  loginName: string;
  password: string;
}

export interface CreatePasswordResponse {
  success: boolean;
  errors: ApiError[] | null;
}

// ==================== TIPOS DE USUÁRIOS ====================

export interface CreateUserRequest {
  loginName: string;
  name: string;
  surname: string;
  email: string;
  active: boolean;
  role: string;
}

export interface CreateUserResponse {
  userId: number;
  errors: ApiError[] | null;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  loginName: string;
  email: string;
  active: boolean;
  userIdentifier: string;
  role: string;
}

export interface GetUserResponse {
  user: User;
  errors: ApiError[] | null;
}

export interface UpdateUserRequest {
  name: string;
  surname: string;
  email: string;
  active: boolean;
  role: string;
}

export interface UpdateUserResponse {
  user: User;
  errors: ApiError[] | null;
}

export interface RolesResponse {
  roles: string[];
}

export interface UsersListQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface UsersListResponse {
  search: string;
  sortBy: string;
  sortOrder: string;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  users: User[];
  errors: ApiError[] | null;
}

export interface ResetPasswordResponse {
  success: boolean;
  errors: ApiError[] | null;
}

// ==================== TIPOS DE LOJAS ====================

export interface SearchStoresRequest {
  rentalCompaniesIds: number[];
  search: string;
  neighborhood?: string;
  city?: string;
  airport?: string;
  isApp?: boolean;
}

export interface StoreOperationTime {
  dayOfTheWeek: string;
  openingTime: string;
  closingTime: string;
}

export interface Airport {
  name: string;
  iata: string;
}

export interface Store {
  acronym: string;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  region: string;
  zipCode: string;
  mapsLocation: string;
  distanceToMainStore: number;
  app: boolean;
  airport: Airport | null;
  storeOperationTimes: StoreOperationTime[];
}

export interface RentalCompanyStores {
  rentalCompanyId: number;
  rentalCompanyName: string;
  stores: Store[];
  airports: {
    name: string;
    storeCount: number;
    stores: string[];
  } | null;
  cities: {
    name: string;
    storeCount: number;
    stores: string[];
  } | null;
  neighborhoods: {
    name: string;
    storeCount: number;
    stores: string[];
  } | null;
}

export interface SearchStoresResponse {
  rentalCompanies: RentalCompanyStores[];
  errors: ApiError[] | null;
}

// ==================== TIPOS DE DISPONIBILIDADE ====================

export interface AvailabilityRequest {
  rentalCompanyId: number;
  pickupDateTime: string;
  returnDateTime: string;
  pickupStore: string;
  returnStore: string;
  couponCode?: string;
  chosenGroups?: string[];
}

export interface AvailabilityRequestPayload {
  availabilities: AvailabilityRequest[];
}

export interface VehicleData {
  model: string;
  category: string;
  vehicleGroup: string;
  vehicleGroupAcronym: string;
  rateQualifier: string;
  agencyName: string;
  agencyCode: number;
  vehicleCode: string;
  agencyGroup: string;
  numberOfDoors: number;
  numberOfSeats: number;
  luggageCapacity: number;
  hasAirConditioning: boolean;
  isAutomaticTransmission: boolean;
  imageUrl: string;
  totalValue: number;
  dailyValue: number;
  administrativeFeePercentage: number;
  bookingValue: number;
  numberOfDays: number;
  returnFeeValue: number;
  totalOvertimeValue: number;
  overtimeValue: number;
  overtimeCoverageValue: number;
  overtimeCoverageFeePercentage: number;
  numberOfOvertimeHours: number;
  returnFeePrice: number;
  returnFeeQuantity: number;
  totalDepositValue: number;
  offer: string | null;
  availabilityToken: string;
  totalDeductibleValue: number;
  isUnlimitedKm: boolean;
  dailyKmLimit: number;
  isMonthly: boolean;
  totalMonthlyDailyRateValue: number;
}

export interface OptionalAddonData {
  name: string;
  description: string;
  addonCode: string;
  totalValue: number;
  dailyValue: number;
  fee: {
    percentage: number;
    totalValue: number;
  } | null;
  maximumQuantity: number;
  maximumChargeableDays: number;
}

export interface CoverageData {
  coverageCode: string;
  name: string;
  description: string;
  totalValue: number;
  dailyValue: number;
  isRequired: boolean;
  sortOrder: number;
  acronym: string;
}

export interface Coupon {
  coupon: string | null;
  valid: boolean;
}

export interface RentalSearch {
  pickupStoreName: string;
  returnStoreName: string;
  pickupStoreCode: string;
  returnStoreCode: string;
  pickupDateTime: string;
  returnDateTime: string;
  distanceToMainStore: number | null;
}

export interface AvailableVehicle {
  vehicleData: VehicleData;
  optionalAddonsData: OptionalAddonData[];
  coveragesData: CoverageData[];
  coupon: Coupon | null;
  rentalSearch: RentalSearch;
}

export interface SearchLog {
  agencyCode: number;
  pickupStore: string;
  returnStore: string;
  pickupDateTime: string;
  returnDateTime: string;
  logRequestResponse: {
    request: string;
    response: string;
  };
}

export interface BookingValueFilter {
  maxAvailabilityValue: number;
  minAvailabilityValue: number;
}

export interface Warning {
  type: string;
  code: string;
  text: string;
}

export interface AvailabilityResponseItem {
  rentalCompanyId: number;
  rentalCompanyName: string;
  availableVehicles: AvailableVehicle[];
  search: SearchLog[];
  bookingValueFilter: BookingValueFilter;
  warnings: Warning[];
  errors: ApiError[] | null;
}

export interface AvailabilityResponse {
  availabilities: AvailabilityResponseItem[];
  errors: ApiError[] | null;
}

// ==================== TIPOS DE RESERVA ====================

export interface BookingCustomer {
  email: string;
  name: string;
  phoneNumber: string;
  documentType: string; // "1" = CPF, "2" = CNPJ, "3" = Passaporte
  document: string;
}

export interface BookingRequest {
  rentalCompanyId: number;
  pickupDateTime: string;
  returnDateTime: string;
  pickupStore: string;
  returnStore: string;
  customer: BookingCustomer;
  vehicleCode: string;
  vehicleGroup: string;
  optionalAddonsCodes?: string[];
  coverageCode: string;
  promotionalCode?: string;
  rateQualifier?: string;
}

// Tipo de compatibilidade para código legado que ainda não foi migrado
// Este tipo mantém a estrutura antiga da API para permitir migração gradual
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
  codigoReservaAgencia?: string;
  [key: string]: unknown;
}

export interface BookingCoverage {
  isRequired: boolean;
  coverageType: string;
  coverageCode: string;
  coverageTypeTitle: string;
  coverageTypeDetails: string | null;
  quantity: number;
  totalValue: number;
  unitPrice: number;
  unitType: string;
  currency: string;
  taxIncluded: boolean;
  includedInRate: boolean;
}

export interface BookingResponseData {
  bookingCode: string;
  bookingStatus: string;
  customerLastName: string;
  customerFirstName: string;
  coverages: BookingCoverage[];
  optionalAddons: unknown[];
  coupon: unknown | null;
}

export interface BasicBookingTotal {
  totalValue: number;
  estimatedValue: number;
  currency: string;
}

export interface LogRequestResponse {
  request: string;
  response: string;
}

export interface BookingResponse {
  warnings: Warning[];
  booking: BookingResponseData;
  basicBookingTotal: BasicBookingTotal;
  logRequestResponse: LogRequestResponse;
  errors: ApiError[] | null;
}

export interface GetBookingDetailsRequest {
  rentalCompanyId: number;
  bookingCode: string;
}

export interface BookingDetailsGroup {
  name: string;
  code: string;
}

export interface BookingDetailsCustomer {
  name: string;
  document: string;
  phoneNumber: string;
  email: string;
}

export interface BookingDetailsPartner {
  partner: string;
  code: string;
}

export interface BookingDetailsCoverage {
  name: string;
  code: string;
}

export interface BookingDetailsResponse {
  status: string;
  bookingCode: string;
  pickupDateTime: string;
  returnDateTime: string;
  pickupStore: string;
  returnStore: string;
  pickupStoreCode: string;
  returnStoreCode: string;
  group: BookingDetailsGroup;
  customer: BookingDetailsCustomer;
  kilometerCap: number | null;
  partner: BookingDetailsPartner;
  totalValue: string;
  coverage: BookingDetailsCoverage;
  errors: ApiError[] | null;
}

export interface UpdateBookingRequest {
  rentalCompanyId: number;
  bookingCode: string;
  pickupDateTime?: string;
  returnDateTime?: string;
  pickupStore?: string;
  returnStore?: string;
  customer?: BookingCustomer;
  vehicleCode?: string;
  vehicleGroup?: string;
  optionalAddonsCodes?: string[];
  coverageCode?: string;
  promotionalCode?: string;
  rateQualifier?: string;
}

export interface UpdateBookingResponse {
  warnings: Warning[];
  booking: BookingResponseData;
  basicBookingTotal: BasicBookingTotal;
  logRequestResponse: LogRequestResponse;
  errors: ApiError[] | null;
}

export interface CancelBookingRequest {
  rentalCompanyId: number;
  bookingCode: string;
  cancellationReason: string;
}

export interface CancelBookingResponse {
  booking: {
    bookingCode: string;
    bookingStatus: string;
    customerLastName: string | null;
    customerFirstName: string | null;
    coverages: BookingCoverage[] | null;
    optionalAddons: unknown[] | null;
    coupon: unknown | null;
  };
  warnings: Warning[];
  logRequestResponse: LogRequestResponse;
  errors: ApiError[] | null;
}

// ==================== TIPOS GERAIS ====================

export interface ApiError {
  code: string;
  message: string;
  status: string;
  type: string;
  field: string;
}

// ==================== CLASSE DO SERVIÇO DE API ====================

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthToken(): string | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.token || null;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Adicionar token de autenticação se disponível
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
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
        // Se o erro for 401 (Unauthorized), fazer logout e limpar token
        if (response.status === 401) {
          // Limpar autenticação antes de processar a resposta
          await authService.logout();
          // Lançar erro específico para que o componente possa tratar se necessário
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }

        // Para outros erros, tentar ler a mensagem de erro do servidor
        let errorMessage = `Erro ${response.status}`;
        let apiErrors: ApiError[] | null = null;
        
        try {
          const errorData = await response.json();
          
          // Verificar se há array de erros na resposta (mesmo com status 500)
          if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            apiErrors = errorData.errors;
            // Se houver array de erros, pegar a primeira mensagem como mensagem principal
            const firstError = errorData.errors[0];
            errorMessage = firstError.message || firstError.text || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' 
              ? errorData.error 
              : errorData.error.message || errorMessage;
          } else if (errorData.title) {
            errorMessage = errorData.title;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
          
          // Mensagens específicas para códigos de status comuns
          if (response.status === 500) {
            errorMessage = errorMessage || 'Erro interno do servidor. Tente novamente mais tarde.';
          } else if (response.status === 404) {
            errorMessage = errorMessage || 'Recurso não encontrado.';
          } else if (response.status === 403) {
            errorMessage = errorMessage || 'Acesso negado.';
          } else if (response.status >= 500) {
            errorMessage = errorMessage || 'Erro no servidor. Tente novamente mais tarde.';
          }
        } catch {
          // Se não conseguir parsear JSON, usar mensagem padrão baseada no status
          if (response.status === 500) {
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          } else if (response.status >= 500) {
            errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
          } else {
            errorMessage = `Erro ${response.status}: ${response.statusText || 'Erro desconhecido'}`;
          }
        }
        
        // Criar erro com informações dos erros da API se houver
        const error = new Error(errorMessage);
        if (apiErrors) {
          (error as Error & { apiErrors: ApiError[] }).apiErrors = apiErrors;
        }
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS DE AUTENTICAÇÃO ====================

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('portal/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async checkFirstAccess(loginName: string): Promise<FirstAccessResponse> {
    return this.request<FirstAccessResponse>(
      `portal/login/isFirstAccess/${loginName}`,
      {
        method: 'GET',
      }
    );
  }

  async createPassword(
    data: CreatePasswordRequest
  ): Promise<CreatePasswordResponse> {
    return this.request<CreatePasswordResponse>(
      'portal/user/registerFirstPassword',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ==================== MÉTODOS DE USUÁRIOS (ADMIN) ====================

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    return this.request<CreateUserResponse>('portal/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUser(userId: number): Promise<GetUserResponse> {
    return this.request<GetUserResponse>(`portal/user/${userId}`, {
      method: 'GET',
    });
  }

  async updateUser(
    userId: number,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    return this.request<UpdateUserResponse>(`portal/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getRoles(): Promise<RolesResponse> {
    return this.request<RolesResponse>('portal/user/roles', {
      method: 'GET',
    });
  }

  async resetPassword(userId: number): Promise<ResetPasswordResponse> {
    return this.request<ResetPasswordResponse>(
      `portal/user/resetPassword/${userId}`,
      {
        method: 'GET',
      }
    );
  }

  async getUsersList(
    params?: UsersListQueryParams
  ): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder)
      queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.pageSize)
      queryParams.append('pageSize', String(params.pageSize));

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `portal/userlist?${queryString}`
      : 'portal/userlist';

    return this.request<UsersListResponse>(endpoint, {
      method: 'GET',
    });
  }

  // ==================== MÉTODOS DE LOJAS ====================

  async searchStores(
    data: SearchStoresRequest
  ): Promise<SearchStoresResponse> {
    const url = `${this.baseURL}searchStores`;
    const token = this.getAuthToken();

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, config);
      
      // Tentar ler o JSON independente do status
      let responseData: SearchStoresResponse;
      try {
        responseData = await response.json();
      } catch {
        // Se não conseguir parsear JSON, lançar erro
        throw new Error(`Erro ${response.status}: Não foi possível processar a resposta do servidor.`);
      }

      // Se a resposta não está OK, verificar se há dados válidos
      if (!response.ok) {
        // Se houver rentalCompanies com dados, retornar os dados mesmo com erro
        if (responseData.rentalCompanies && Array.isArray(responseData.rentalCompanies) && responseData.rentalCompanies.length > 0) {
          // Retornar os dados disponíveis junto com os erros
          return responseData;
        }
        
        // Se não houver dados válidos, tratar como erro
        // Se o erro for 401 (Unauthorized), fazer logout
        if (response.status === 401) {
          await authService.logout();
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }

        // Para outros erros, criar mensagem de erro
        let errorMessage = `Erro ${response.status}`;
        if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          const firstError = responseData.errors[0];
          errorMessage = firstError.message || errorMessage;
        }
        
        const error = new Error(errorMessage);
        if (responseData.errors) {
          (error as Error & { apiErrors: ApiError[] }).apiErrors = responseData.errors;
        }
        throw error;
      }

      // Se tudo OK, retornar os dados normalmente
      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS DE DISPONIBILIDADE ====================

  async getAvailability(
    data: AvailabilityRequestPayload
  ): Promise<AvailabilityResponse> {
    return this.request<AvailabilityResponse>('availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== MÉTODOS DE COMPATIBILIDADE (LEGADO) ====================
  // Estes métodos mantêm compatibilidade com código legado que ainda não foi migrado

  async getPartners(_tipoTarifa?: string): Promise<PartnersResponse> {
    // Na nova API não há endpoint de parcerias/tarifas
    // Parâmetro mantido apenas para compatibilidade com código legado
    void _tipoTarifa; // Marca explicitamente como não usado
    return Promise.resolve({ dados: [] });
  }

  async getAvailableAgencies(): Promise<AvailableAgenciesResponse> {
    // Na nova API, as locadoras são identificadas por rentalCompanyId
    // Retornar lista básica com as 4 locadoras disponíveis
    return Promise.resolve({
      dados: [
        { codigo: 1, nome: 'Movida', nomeAgencia: 'Movida' },
        { codigo: 2, nome: 'Localiza', nomeAgencia: 'Localiza' },
        { codigo: 3, nome: 'Unidas', nomeAgencia: 'Unidas' },
        { codigo: 4, nome: 'Foco', nomeAgencia: 'Foco' },
      ],
    });
  }

  async getLocations(
    data: GetLocationsRequest
  ): Promise<LocationsResponse & { errors?: ApiError[] | null }> {
    // Adaptar para usar searchStores da nova API
    const searchStoresData: SearchStoresRequest = {
      rentalCompaniesIds: [1, 2, 3, 4], // Todas as locadoras
      search: data.filtro || '',
      neighborhood: '',
      city: '',
      airport: '',
      isApp: false,
    };

    if (data.locadoras && data.locadoras.length > 0) {
      // Converter nomes de locadoras para IDs se necessário
      const rentalCompanyMap: Record<string, number> = {
        movida: 1,
        localiza: 2,
        unidas: 3,
        foco: 4,
      };
      searchStoresData.rentalCompaniesIds = data.locadoras
        .map((loc) => rentalCompanyMap[loc.toLowerCase()])
        .filter((id) => id !== undefined) as number[];
    }

    const response = await this.searchStores(searchStoresData);

    // Transformar resposta da nova API para formato legado
    const locations: LocationsResponse & { errors?: ApiError[] | null } = {
      dados: {
        Aeroportos: [],
        TodasLojas: [],
        Cidades: [],
        Bairro: [],
      },
      errors: response.errors || null,
    };

    // Processar dados mesmo se houver erros (pode ter dados parciais)

    response.rentalCompanies.forEach((company) => {
      company.stores.forEach((store) => {
        locations.dados.TodasLojas.push({
          nome: store.name,
          sigla: store.acronym,
          lojas: [store.acronym],
          qtLojas: 1,
          rentalCompanyId: company.rentalCompanyId,
          rentalCompanyName: company.rentalCompanyName,
        });

        if (store.city && !locations.dados.Cidades.find((c) => c.nome === store.city)) {
          locations.dados.Cidades.push({
            nome: store.city,
            sigla: store.city,
            lojas: company.stores
              .filter((s) => s.city === store.city)
              .map((s) => s.acronym),
            qtLojas: company.stores.filter((s) => s.city === store.city).length,
          });
        }

        if (store.neighborhood && !locations.dados.Bairro.find((b) => b.nome === store.neighborhood)) {
          locations.dados.Bairro.push({
            nome: store.neighborhood,
            sigla: store.neighborhood,
            lojas: company.stores
              .filter((s) => s.neighborhood === store.neighborhood)
              .map((s) => s.acronym),
            qtLojas: company.stores.filter((s) => s.neighborhood === store.neighborhood).length,
          });
        }

        if (store.airport) {
          const airportName = store.airport.name;
          if (!locations.dados.Aeroportos.find((a) => a.nome === airportName)) {
            locations.dados.Aeroportos.push({
              nome: airportName,
              sigla: store.airport.iata,
              lojas: company.stores
                .filter((s) => s.airport?.name === airportName)
                .map((s) => s.acronym),
              qtLojas: company.stores.filter((s) => s.airport?.name === airportName).length,
            });
          }
        }
      });
    });

    return locations;
  }

  async verifyAvailableCars(
    codigoAgencia: number,
    data: VerifyAvailableCarsRequest
  ): Promise<AvailableCarsResponse> {
    void codigoAgencia; // Não usado, mas mantido para compatibilidade
    // Adaptar para usar getAvailability da nova API
    // Mapear rentalCompanyId baseado no codigoAgencia ou usar todas
    const rentalCompanyIds = data.locadoras
      ? data.locadoras.map((loc) => {
          const rentalCompanyMap: Record<string, number> = {
            movida: 1,
            localiza: 2,
            unidas: 3,
            foco: 4,
          };
          return rentalCompanyMap[loc.toLowerCase()] || 1;
        })
      : [1, 2, 3, 4]; // Todas as locadoras se não especificado

    const availabilityRequests: AvailabilityRequest[] = rentalCompanyIds.map(
      (rentalCompanyId) => ({
        rentalCompanyId,
        pickupDateTime: data.dataHoraRetirada,
        returnDateTime: data.dataHoraDevolucao,
        pickupStore: data.locaisRetirada[0] || '',
        returnStore: data.locaisDevolucao[0] || '',
        couponCode: data.codCupom,
        chosenGroups: data.tarifas?.map((t) => t.codigo || '') || [],
      })
    );

    const response = await this.getAvailability({
      availabilities: availabilityRequests,
    });

    // Verificar se cupom foi enviado na requisição
    const hasCouponInRequest = !!data.codCupom;
    
    // Verificar validade do cupom em todos os veículos
    let couponValid: boolean | undefined = undefined;
    if (hasCouponInRequest) {
      // Se cupom foi enviado, verificar se é válido em pelo menos um veículo
      couponValid = response.availabilities.some((availability) =>
        availability.availableVehicles.some(
          (vehicle) => vehicle.coupon?.valid === true
        )
      );
    }

    // Return data directly from API in English format
    const availableVehicles: AvailableVehicle[] = [];
    let minValue = Infinity;
    let maxValue = -Infinity;

    response.availabilities.forEach((availability) => {
      availability.availableVehicles.forEach((vehicle) => {
        const vehicleValue = vehicle.vehicleData.totalValue || vehicle.vehicleData.bookingValue || 0;
        if (vehicleValue < minValue) minValue = vehicleValue;
        if (vehicleValue > maxValue) maxValue = vehicleValue;

        availableVehicles.push(vehicle);
      });
    });

    const availableCars: AvailableCarsResponse = {
      data: {
        availableVehicles,
        couponFilter: hasCouponInRequest
          ? {
              valid: couponValid ?? false,
            }
          : undefined,
        priceRangeFilter:
          availableVehicles.length > 0 && minValue !== Infinity && maxValue !== -Infinity
            ? {
                minAvailabilityValue: minValue,
                maxAvailabilityValue: maxValue,
              }
            : undefined,
      },
    };

    return availableCars;
  }

  // ==================== MÉTODOS DE RESERVA ====================

  async createBooking(data: BookingRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>('booking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookingDetails(
    data: GetBookingDetailsRequest
  ): Promise<BookingDetailsResponse> {
    return this.request<BookingDetailsResponse>('booking/getDetails', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBooking(
    data: UpdateBookingRequest
  ): Promise<UpdateBookingResponse> {
    return this.request<UpdateBookingResponse>('booking/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(
    data: CancelBookingRequest
  ): Promise<CancelBookingResponse> {
    return this.request<CancelBookingResponse>('booking/cancel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== MÉTODOS DE COMPATIBILIDADE PARA RESERVAS ====================

  async editBooking(
    agencyCode: number,
    bookingCode: string,
    updateData: {
      dataHoraRetirada?: string;
      dataHoraDevolucao?: string;
      localRetirada?: string;
      localDevolucao?: string;
      [key: string]: unknown;
    }
  ): Promise<UpdateBookingResponse> {
    // Adaptar para usar updateBooking da nova API
    // Mapear agencyCode para rentalCompanyId (assumindo que agencyCode corresponde ao rentalCompanyId)
    const rentalCompanyId = agencyCode > 0 && agencyCode <= 4 ? agencyCode : 1;

    const updateRequest: UpdateBookingRequest = {
      rentalCompanyId,
      bookingCode,
      pickupDateTime: updateData.dataHoraRetirada,
      returnDateTime: updateData.dataHoraDevolucao,
      pickupStore: updateData.localRetirada as string | undefined,
      returnStore: updateData.localDevolucao as string | undefined,
    };

    return this.updateBooking(updateRequest);
  }

  // Métodos de compatibilidade adicionais
  async getProfiles(): Promise<{ dados: Profile[] }> {
    const roles = await this.getRoles();
    return {
      dados: roles.roles.map((role, index) => ({
        tipoUsuarioId: index + 1,
        nome: role,
      })),
    };
  }

  async getUsers(params?: {
    key?: string;
    page?: number;
    qtPorPagina?: number;
  }): Promise<{ dados: { Itens: AdminUser[]; PaginaAtual: number; TotalItens: number } }> {
    const response = await this.getUsersList({
      search: params?.key,
      page: params?.page,
      pageSize: params?.qtPorPagina,
    });
    
    // Buscar perfis para mapear role para tipoUsuarioId
    const profilesResponse = await this.getProfiles();
    // Criar mapa de role (nome do perfil) para tipoUsuarioId
    // Os perfis são mapeados na mesma ordem dos roles retornados
    const roleToTipoUsuarioId: Record<string, number> = {};
    profilesResponse.dados.forEach((profile) => {
      // O nome do perfil é o role (ex: 'administrator', 'operator')
      roleToTipoUsuarioId[profile.nome.toLowerCase()] = profile.tipoUsuarioId;
    });
    
    return {
      dados: {
        Itens: response.users.map((user) => {
          // Mapear role para tipoUsuarioId
          // Buscar pelo nome do perfil que corresponde ao role
          const tipoUsuarioId = roleToTipoUsuarioId[user.role.toLowerCase()] || 
            (user.role === 'administrator' ? 1 : 2);
          const profile = profilesResponse.dados.find(p => p.tipoUsuarioId === tipoUsuarioId);
          
          return {
            usuarioId: user.id,
            nome: user.name,
            sobrenome: user.surname,
            email: user.email,
            nomeLogin: user.loginName,
            ativo: user.active,
            role: user.role,
            tipoUsuario: profile ? {
              tipoUsuarioId: profile.tipoUsuarioId,
              nome: profile.nome,
            } : undefined,
          };
        }),
        PaginaAtual: response.pagination.currentPage,
        TotalItens: response.pagination.totalCount,
      },
    };
  }

  async getLogFile(_reservationCode: string): Promise<Blob> {
    // Na nova API não há endpoint de logs
    // Retornar blob vazio por enquanto
    return Promise.resolve(new Blob());
  }

  async resendVoucher(_codeBooking: string): Promise<unknown> {
    // Na nova API não há endpoint de reenvio de voucher
    // Retornar sucesso por enquanto
    return Promise.resolve({ success: true });
  }

  async getCancellationReasons(): Promise<{ dados: CancellationReason[] }> {
    // Na nova API não há endpoint de motivos de cancelamento
    // Retornar lista padrão
    return Promise.resolve({
      dados: [
        { codigo: '1', descricao: 'Cliente solicitou cancelamento' },
        { codigo: '2', descricao: 'Problema com pagamento' },
        { codigo: '3', descricao: 'Mudança de planos' },
        { codigo: '4', descricao: 'Outro motivo' },
      ],
    });
  }

  async startAttendance(_data: {
    codigoAgencia: number;
    tokenAtendimento?: string;
  }): Promise<{ dados: number }> {
    // Na nova API não há endpoint de atendimento
    // Retornar protocolo simulado baseado em timestamp
    return Promise.resolve({
      dados: Date.now(),
    });
  }

  async booking(
    idCarrental: number,
    data: QuotationRequest
  ): Promise<BookingResponse & { dados: unknown; protocolo: string }> {
    // Adaptar QuotationRequest para BookingRequest
    const rentalCompanyId = idCarrental > 0 && idCarrental <= 4 ? idCarrental : 1;

    // Converter dados do cliente
    const customer: BookingCustomer = {
      email: data.dadosCliente.email,
      name: `${data.dadosCliente.nome} ${data.dadosCliente.sobrenome}`,
      phoneNumber: `+55 (${data.dadosCliente.dddCelular}) ${data.dadosCliente.Celular}`,
      documentType: String(data.dadosCliente.tipoDocumento),
      document: data.dadosCliente.documento,
    };

    // Extrair vehicleCode e vehicleGroup do selectedCar ou usar valores padrão
    const vehicleCode = (data as unknown as { vehicleCode?: string }).vehicleCode || '';
    const vehicleGroup = data.categoria || '';

    const bookingRequest: BookingRequest = {
      rentalCompanyId,
      pickupDateTime: data.dataHoraRetirada,
      returnDateTime: data.dataHoraDevolucao,
      pickupStore: data.localRetirada,
      returnStore: data.localDevolucao,
      customer,
      vehicleCode,
      vehicleGroup,
      coverageCode: (data.protecoes?.[0] as { codigo?: string })?.codigo || 'BAS',
      promotionalCode: data.codigoPromocional,
      rateQualifier: data.rateQualifier,
    };

    const response = await this.createBooking(bookingRequest);
    return {
      ...response,
      dados: {
        reserva: response.booking,
        totalbasicoReserva: response.basicBookingTotal,
      },
      protocolo: data.protocolo,
    };
  }

  async quotation(
    _idCarrental: number,
    _data: QuotationRequest
  ): Promise<unknown> {
    // Na nova API, quotation é substituído por availability
    // Retornar sucesso por enquanto
    return Promise.resolve({ success: true });
  }

  async listBookings(
    _idCarrental: number,
    _document: string
  ): Promise<{ dados: Booking[] }> {
    // Na nova API não há endpoint de listagem de reservas por documento
    // Retornar array vazio por enquanto
    return Promise.resolve({ dados: [] });
  }

  async findCustomer(_documento: string): Promise<{
    dados: {
      clienteId: number;
      nomeCompleto: string;
      email: string;
      telefone: string;
      documento: string;
      tipoDocumentoId: number;
      [key: string]: unknown;
    };
  }> {
    // Na nova API não há endpoint de busca de cliente
    // Retornar erro ou dados vazios
    return Promise.reject(new Error('Endpoint não disponível na nova API'));
  }

  async saveCustomer(_data: {
    nomeCompleto: string;
    email: string;
    telefone: string;
    documento: string;
    tipoDocumentoId: number;
  }): Promise<{ dados: { clienteId: number } }> {
    // Na nova API não há endpoint de criação de cliente
    // Retornar ID simulado
    return Promise.resolve({ dados: { clienteId: Date.now() } });
  }

  async editCustomer(
    _clienteId: number,
    _data: {
      nomeCompleto: string;
      email: string;
      telefone: string;
      documento: string;
      tipoDocumentoId: number;
    }
  ): Promise<{ dados: unknown }> {
    // Na nova API não há endpoint de edição de cliente
    // Retornar sucesso
    return Promise.resolve({ dados: {} });
  }
}

// ==================== TIPOS DE COMPATIBILIDADE (LEGADO) ====================
// Estes tipos mantêm compatibilidade com código legado que ainda não foi migrado

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
  rentalCompanyId?: number;
  rentalCompanyName?: string;
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

// New English-based response type
export interface AvailableCarsResponse {
  data: {
    couponFilter?: {
      valid: boolean;
    };
    availableVehicles: AvailableVehicle[];
    priceRangeFilter?: {
      minAvailabilityValue: number;
      maxAvailabilityValue: number;
    };
    [key: string]: unknown;
  };
}

// Legacy Portuguese type (deprecated, kept for backward compatibility)
export interface AvailableCarsResponseLegacy {
  dados: {
    filtroCupom?: {
      valido: boolean;
    };
    veiculosDisponiveis: Array<{
      dadosVeiculo: {
        modelo: string;
        categoria: string;
        grupoVeiculo: string;
        codigoAcriss?: string;
        rateQualifier?: string;
        codigoVeiculo: string;
        numeroPortas: number;
        numeroAssentos: number;
        capacidadeBagagem: number;
        temArCondicionado: boolean;
        isAutomatico: boolean;
        imagemUrl: string;
        valorTotal: number;
        valorDiaria: number;
        numeroDias: number;
        tokenCotacao: string;
        isMensal?: boolean;
        [key: string]: unknown;
      };
      opcionais: unknown[];
      protecoes: unknown[];
      pesquisaLocacao: {
        localRetiradaNome: string;
        localDevolucaoNome: string;
        localRetiradaSigla: string;
        localDevolucaoSigla: string;
        dataHoraRetirada: string;
        dataHoraDevolucao: string;
      };
      rentalCompanyId?: number;
      rentalCompanyName?: string;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
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

export interface CancellationReason {
  codigo: string;
  descricao: string;
  [key: string]: unknown;
}

export interface AdminUser {
  usuarioId: number;
  id?: number;
  nome: string;
  sobrenome?: string;
  email: string;
  nomeLogin: string;
  loginName?: string;
  ativo: boolean;
  active?: boolean;
  acessado?: boolean;
  tipoUsuario?: {
    tipoUsuarioId: number;
    nome: string;
    [key: string]: unknown;
  };
  role?: string;
  [key: string]: unknown;
}

export interface Profile {
  tipoUsuarioId: number;
  nome: string;
  [key: string]: unknown;
}

// ==================== ENUMS E CONSTANTES ====================

/**
 * Enum de tipos de documento
 * Mapeia para os valores esperados pela API:
 * "1" = CPF, "2" = CNPJ, "3" = Passaporte
 */
export const DocumentTypesEnum = {
  CPF: 1,
  CNPJ: 2,
  PASSAPORT: 3,
} as const;

export type DocumentTypesEnumValue =
  typeof DocumentTypesEnum[keyof typeof DocumentTypesEnum];

export const apiService = new ApiService();
export default apiService;
