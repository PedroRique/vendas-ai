import { API_BASE_URL } from '../config/environment';

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
  offer: string;
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
  };
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
  coupon: string;
  valid: boolean;
}

export interface RentalSearch {
  pickupStoreName: string;
  returnStoreName: string;
  pickupStoreCode: string;
  returnStoreCode: string;
  pickupDateTime: string;
  returnDateTime: string;
  distanceToMainStore: number;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
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
    return this.request<SearchStoresResponse>('searchStores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
