import type { TenantId } from '../tenant';
import type {
  AvailabilityRequestPayload,
  AvailabilityResponse,
  AvailabilityResponseItem,
  AvailableVehicle,
  ApiError,
} from './api';

export type ApiRequestFn = <T>(
  endpoint: string,
  options?: RequestInit
) => Promise<T>;

export interface AvailabilityTransport {
  getAvailability(
    req: ApiRequestFn,
    data: AvailabilityRequestPayload
  ): Promise<AvailabilityResponse>;
}

interface FocoAvailabilityRequest {
  pickupDateTime: string;
  returnDateTime: string;
  pickupStore: string;
  returnStore: string;
  couponCode?: string;
  chosenGroups?: string[];
}

interface FocoAvailabilityResponse {
  availableVehicles: AvailableVehicle[];
  bookingValueFilter?: {
    maxAvailabilityValue: number;
    minAvailabilityValue: number;
  } | null;
  warnings?: { type: string; code: string; text: string }[];
  errors?: ApiError[] | null;
}

const aluguelAvailabilityTransport: AvailabilityTransport = {
  getAvailability: (req, data) =>
    req<AvailabilityResponse>('availability', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

const focoAvailabilityTransport: AvailabilityTransport = {
  getAvailability: async (req, data) => {
    const first = data.availabilities[0];
    if (!first) {
      return { availabilities: [], errors: null };
    }

    const focoRequest: FocoAvailabilityRequest = {
      pickupDateTime: first.pickupDateTime,
      returnDateTime: first.returnDateTime,
      pickupStore: first.pickupStore,
      returnStore: first.returnStore,
      couponCode: first.couponCode || '',
      chosenGroups: first.chosenGroups || [],
    };

    const focoResponse = await req<FocoAvailabilityResponse>('availability', {
      method: 'POST',
      body: JSON.stringify(focoRequest),
    });

    const responseItem: AvailabilityResponseItem = {
      rentalCompanyId: 4,
      rentalCompanyName: 'Foco',
      availableVehicles: focoResponse.availableVehicles || [],
      search: [],
      bookingValueFilter: focoResponse.bookingValueFilter ?? {
        maxAvailabilityValue: 0,
        minAvailabilityValue: 0,
      },
      warnings: (focoResponse.warnings || []).map((w) => ({
        type: w.type || '',
        code: w.code || '',
        text: w.text || '',
      })),
      errors: focoResponse.errors || null,
    };

    return {
      availabilities: [responseItem],
      errors: focoResponse.errors || null,
    };
  },
};

const TRANSPORTS: Record<TenantId, AvailabilityTransport> = {
  alugueldecarro: aluguelAvailabilityTransport,
  foco: focoAvailabilityTransport,
};

export function getAvailabilityTransport(tenantId: TenantId): AvailabilityTransport {
  return TRANSPORTS[tenantId];
}
