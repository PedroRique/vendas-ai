export type TenantId = 'alugueldecarro' | 'foco';

export interface TenantBookingFeatures {
  update: boolean;
  cancel: boolean;
  resendVoucher: boolean;
  downloadLogs: boolean;
}

export interface TenantConfig {
  id: TenantId;
  branding: {
    logoSrc: string;
    logoAlt: string;
  };
  features: {
    multiRentalCompany: boolean;
    /** IDs usados em searchStores / availability quando não há filtro por nome */
    rentalCompanyIdsForSearch: number[];
    booking: TenantBookingFeatures;
  };
  copy: {
    reservasSearchLabel: string;
    reservasSearchPlaceholder: string;
    reservasSearchRequiredDetail: string;
  };
}
