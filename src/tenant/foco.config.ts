import logoSrc from '../assets/foco-vermelho.png';
import type { TenantConfig } from './types';

export const focoConfig: TenantConfig = {
  id: 'foco',
  branding: {
    logoSrc,
    logoAlt: 'Foco',
  },
  features: {
    multiRentalCompany: false,
    rentalCompanyIdsForSearch: [4],
    booking: {
      update: false,
      cancel: true,
      resendVoucher: false,
      downloadLogs: false,
    },
  },
  copy: {
    reservasSearchLabel: 'Código da reserva',
    reservasSearchPlaceholder: 'Digite o código da reserva',
    reservasSearchRequiredDetail: 'Por favor, digite o código da reserva.',
  },
};
