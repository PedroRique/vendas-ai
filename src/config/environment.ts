// Configuração de ambiente para nova API
export const ENVIRONMENT = {
  // Base URL da nova API
  API_BASE_URL: 'https://api.alugueldecarro.ai/',
  
  // Mapeamento de rentalCompanyId para nomes
  RENTAL_COMPANIES: {
    1: 'Movida',
    2: 'Localiza',
    3: 'Unidas',
    4: 'Foco'
  } as const
};

// Configuração atual do ambiente
export const API_BASE_URL = ENVIRONMENT.API_BASE_URL;
export const RENTAL_COMPANIES = ENVIRONMENT.RENTAL_COMPANIES;
