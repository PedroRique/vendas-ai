import logoSrc from '../assets/alugueldecarroai-preto.png';
import type { TenantConfig } from './types';

export const alugueldecarroConfig: TenantConfig = {
  id: 'alugueldecarro',
  branding: {
    logoSrc,
    logoAlt: 'Aluguel de Carro AI',
    faviconPath: '/favicon.ico',
    pageTitle: 'Aluguel de Carro - Vendas',
  },
  features: {
    multiRentalCompany: true,
    rentalCompanyIdsForSearch: [1, 2, 3, 4],
    booking: {
      update: true,
      cancel: true,
      resendVoucher: true,
      downloadLogs: true,
    },
  },
  copy: {
    reservasSearchLabel: 'Reserva ou CPF',
    reservasSearchPlaceholder: 'Digite o CPF ou código da reserva',
    reservasSearchRequiredDetail:
      'Por favor, digite o CPF ou código da reserva.',
  },
};
