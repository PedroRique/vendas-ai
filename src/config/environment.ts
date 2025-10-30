// Configuração de ambiente baseada no sistema antigo
export const ENVIRONMENT = {
  // URLs da API baseadas no sistema AngularJS
  API_URLS: {
    dev: '//localhost:5000/api/',
    homolog: '//apibookinghmg.zoss.com.br/api/',
    prod: 'https://apibooking.zoss.com.br/api/'
  },
  
  // Códigos de origem (baseados no sistema antigo)
  ORIGIN_CODES: {
    dev: '9b519887127e42eab74cc1dd19b2a30d',
    homolog: '58e3fd7717b64375b02ceef34e2439ec',
    prod: '9b519887127e42eab74cc1dd19b2a30d'
  },
  
  // Tokens (baseados no sistema antigo)
  TOKENS: {
    dev: '9ec365a9a6664414ac8927b1bda4744c',
    homolog: 'c787dc81a50b467ca19d9eba7572c684',
    prod: 'c325452a3cf7473e85d375faca1ee812'
  }
};

// Função para determinar o ambiente atual
export function getCurrentEnvironment(): keyof typeof ENVIRONMENT.API_URLS {
  const host = window.location.host;
  
  if (/dev\./.test(host)) {
    return 'dev';
  } else if (/localhost|hmg|127|fera|crmhmg|carrentalzchat\./.test(host)) {
    return 'homolog';
  } else if (/chat|local|zoss|crm|zoss-movida\./.test(host)) {
    return 'prod';
  }
  
  return 'prod';
}

// Configuração atual do ambiente
export const CURRENT_ENV = getCurrentEnvironment();
export const API_BASE_URL = ENVIRONMENT.API_URLS[CURRENT_ENV];
export const ORIGIN_CODE = ENVIRONMENT.ORIGIN_CODES[CURRENT_ENV];
export const TOKEN = ENVIRONMENT.TOKENS[CURRENT_ENV];
