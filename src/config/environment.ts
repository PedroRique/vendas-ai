// Base URL vem do build (Vite); fallback para desenvolvimento sem .env de modo.
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/?$/, '/') ||
  'https://api.alugueldecarro.ai/';

export const ENVIRONMENT = {
  API_BASE_URL,
  RENTAL_COMPANIES: {
    1: 'Movida',
    2: 'Localiza',
    3: 'Unidas',
    4: 'Foco',
  } as const,
};

export const RENTAL_COMPANIES = ENVIRONMENT.RENTAL_COMPANIES;
