import { RENTAL_COMPANIES } from '../config/environment';
import type { TenantId } from '../tenant';
import type {
  Booking,
  BookingDetailsResponse,
  BookingRequest,
  BookingResponse,
  CancelBookingRequest,
  CancelBookingResponse,
  UpdateBookingRequest,
  UpdateBookingResponse,
} from './api';

export type ApiRequestFn = <T>(
  endpoint: string,
  options?: RequestInit
) => Promise<T>;

export interface BookingTransport {
  createBooking(
    req: ApiRequestFn,
    data: BookingRequest
  ): Promise<BookingResponse>;
  getBookingDetails(
    req: ApiRequestFn,
    rentalCompanyId: number,
    bookingCode: string
  ): Promise<BookingDetailsResponse>;
  updateBooking(
    req: ApiRequestFn,
    data: UpdateBookingRequest
  ): Promise<UpdateBookingResponse>;
  cancelBooking(
    req: ApiRequestFn,
    data: CancelBookingRequest
  ): Promise<CancelBookingResponse>;
  listBookings(
    req: ApiRequestFn,
    agencyCode: number,
    query: string
  ): Promise<Booking[]>;
}

function agencyLabel(cod: number): string {
  const name = RENTAL_COMPANIES[cod as keyof typeof RENTAL_COMPANIES];
  return name ?? 'Locadora';
}

export function mapBookingDetailsToBooking(
  details: BookingDetailsResponse,
  reservaId: number,
  rentalCompanyId: number
): Booking {
  const st = (details.status || '').trim();
  const statusNome =
    /^confirmed$/i.test(st) || /^approved$/i.test(st) ? 'Booked' : details.status;

  const total =
    typeof details.totalValue === 'string'
      ? parseFloat(details.totalValue.replace(',', '.')) || 0
      : Number(details.totalValue) || 0;

  return {
    reservaId,
    codigoReserva: details.bookingCode,
    codigoReservaAgencia: details.bookingCode,
    dataRetirada: details.pickupDateTime,
    dataDevolucao: details.returnDateTime,
    statusReserva: { nome: statusNome },
    grupoVeiculo: details.group?.name || '',
    lojaRetirada: {
      nome: details.pickupStore,
      agencia: {
        codAgencia: rentalCompanyId,
        nome: agencyLabel(rentalCompanyId),
      },
    },
    lojaDevolucao: {
      nome: details.returnStore,
    },
    valorTotalApurado: total,
    cliente: {
      nomeCompleto: details.customer?.name,
      name: details.customer?.name,
      email: details.customer?.email || '',
      tel: details.customer?.phoneNumber,
    },
  };
}

function isNotFoundError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  const m = e.message.toLowerCase();
  return m.includes('404') || m.includes('não encontrad') || m.includes('nao encontrad');
}

async function fetchDetailsAsBookings(
  req: ApiRequestFn,
  rentalCompanyId: number,
  bookingCode: string
): Promise<Booking[]> {
  try {
    const d = await req<BookingDetailsResponse>('booking/getDetails', {
      method: 'POST',
      body: JSON.stringify({ rentalCompanyId, bookingCode }),
    });
    if (d.errors && d.errors.length > 0) return [];
    if (!d.bookingCode) return [];
    return [mapBookingDetailsToBooking(d, 1, rentalCompanyId)];
  } catch (e) {
    if (isNotFoundError(e)) return [];
    throw e;
  }
}

interface FocoBookingDetailsRaw {
  error?: string;
  status?: string;
  bookingCode?: string;
  pickupDateTime?: string;
  returnDateTime?: string;
  pickupStore?: string;
  returnStore?: string;
  pickupStoreCode?: string;
  returnStoreCode?: string;
  group?: { name?: string; code?: string };
  customer?: {
    name?: string;
    document?: string;
    phoneNumber?: string;
    email?: string;
  };
  totalValue?: string;
  coverage?: { name?: string; code?: string };
  errors?: unknown[] | null;
}

function focoRawToDetails(raw: FocoBookingDetailsRaw): BookingDetailsResponse {
  return {
    status: raw.status || '',
    bookingCode: raw.bookingCode || '',
    pickupDateTime: raw.pickupDateTime || '',
    returnDateTime: raw.returnDateTime || '',
    pickupStore: raw.pickupStore || '',
    returnStore: raw.returnStore || '',
    pickupStoreCode: raw.pickupStoreCode || '',
    returnStoreCode: raw.returnStoreCode || '',
    group: {
      name: raw.group?.name || '',
      code: raw.group?.code || '',
    },
    customer: {
      name: raw.customer?.name || '',
      document: raw.customer?.document || '',
      phoneNumber: raw.customer?.phoneNumber || '',
      email: raw.customer?.email || '',
    },
    kilometerCap: null,
    partner: { partner: '', code: '' },
    totalValue: raw.totalValue ?? '0',
    coverage: {
      name: raw.coverage?.name || '',
      code: raw.coverage?.code || '',
    },
    errors: (raw.errors as BookingDetailsResponse['errors']) ?? null,
  };
}

const aluguelBookingTransport: BookingTransport = {
  createBooking: (req, data) =>
    req<BookingResponse>('booking', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBookingDetails: (req, rentalCompanyId, bookingCode) =>
    req<BookingDetailsResponse>('booking/getDetails', {
      method: 'POST',
      body: JSON.stringify({ rentalCompanyId, bookingCode }),
    }),

  updateBooking: (req, data) =>
    req<UpdateBookingResponse>('booking/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancelBooking: (req, data) =>
    req<CancelBookingResponse>('booking/cancel', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listBookings: async (req, agencyCode, query) => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const rc = agencyCode > 0 && agencyCode <= 4 ? agencyCode : 1;
    return fetchDetailsAsBookings(req, rc, trimmed);
  },
};

const focoBookingTransport: BookingTransport = {
  createBooking: (req, data) => {
    const body = {
      pickupDateTime: data.pickupDateTime,
      returnDateTime: data.returnDateTime,
      pickupStore: data.pickupStore,
      returnStore: data.returnStore,
      customer: data.customer,
      vehicleCode: data.vehicleCode,
      vehicleGroup: data.vehicleGroup,
      optionalAddonsCodes: data.optionalAddonsCodes,
      coverageCode: data.coverageCode,
      promotionalCode: data.promotionalCode,
      rateQualifier: data.rateQualifier,
    };
    return req<BookingResponse>('booking', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getBookingDetails: async (req, _rentalCompanyId, bookingCode) => {
    const raw = await req<FocoBookingDetailsRaw>(
      `bookingDetails/${encodeURIComponent(bookingCode)}`,
      { method: 'GET' }
    );
    if (raw.error) {
      throw new Error(
        typeof raw.error === 'string' ? raw.error : 'Erro ao buscar reserva.'
      );
    }
    return focoRawToDetails(raw);
  },

  updateBooking: () => {
    return Promise.reject(
      new Error('Edição de reserva não está disponível neste portal.')
    );
  },

  cancelBooking: (req, data) =>
    req<CancelBookingResponse>(
      `cancel/${encodeURIComponent(data.bookingCode)}`,
      {
        method: 'POST',
        body: JSON.stringify({
          bookingCode: data.bookingCode,
          cancellationReason: data.cancellationReason,
        }),
      }
    ),

  listBookings: async (req, _agencyCode, query) => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    try {
      const details = await focoBookingTransport.getBookingDetails(
        req,
        4,
        trimmed
      );
      if (details.errors && details.errors.length > 0) return [];
      if (!details.bookingCode) return [];
      return [mapBookingDetailsToBooking(details, 1, 4)];
    } catch (e) {
      if (isNotFoundError(e)) return [];
      throw e;
    }
  },
};

const TRANSPORTS: Record<TenantId, BookingTransport> = {
  alugueldecarro: aluguelBookingTransport,
  foco: focoBookingTransport,
};

export function getBookingTransport(tenantId: TenantId): BookingTransport {
  return TRANSPORTS[tenantId];
}
