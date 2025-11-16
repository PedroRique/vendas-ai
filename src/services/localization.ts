import { apiService, type Partner, type LocationsResponse, type AvailableCarsResponse, type VerifyAvailableCarsRequest, type GetLocationsRequest, type Agency } from './api';

// Re-export Partner for convenience
export type { Partner } from './api';

export interface LocationPlace {
  nome: string;
  sigla?: string;
  lojas?: string[];
  qtLojas: number;
  rentalCompanyId?: number;
  rentalCompanyName?: string;
}

export interface LocalizationFormData {
  selectedPartner: Partner | null;
  getCarPlace: LocationPlace | null;
  retrievePlace: LocationPlace | null;
  getCarDate: Date;
  getCarHour: Date;
  retrieveDate: Date;
  retrieveHour: Date;
  coupon: string;
  selectedFranchiseKm: Partner | null;
  showRetrieve: boolean;
}

export class LocalizationService {
  /**
   * Busca lista de parcerias e tarifas
   */
  async getPartners(tipoTarifa: string = ''): Promise<Partner[]> {
    try {
      const response = await apiService.getPartners(tipoTarifa);
      return response.dados || [];
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  }

  /**
   * Busca lista de locadoras disponíveis
   */
  async getLocadoras(): Promise<Agency[]> {
    try {
      const response = await apiService.getAvailableAgencies();
      return response.dados || [];
    } catch (error) {
      console.error('Error fetching locadoras:', error);
      throw error;
    }
  }

  /**
   * Busca locais (aeroportos, cidades, bairros, lojas)
   */
  async getLocations(
    search: string,
    codAgencia: number | null | undefined,
    locadoras?: string[]
  ): Promise<LocationsResponse['dados'] & { errors?: unknown[] }> {
    try {
      if (search.length < 3) {
        return {
          Aeroportos: [],
          TodasLojas: [],
          Cidades: [],
          Bairro: [],
        };
      }

      // Preparar dados da requisição
      // O API requer codAgencia sempre presente na requisição
      const requestData: GetLocationsRequest = {
        filtro: search,
      };

      // Sempre incluir codAgencia (API requer este campo)
      // Se não disponível, usar 100 como padrão (mesmo comportamento do sistema antigo para "Vendas")
      if (codAgencia !== null && codAgencia !== undefined && codAgencia > 0) {
        requestData.codAgencia = codAgencia;
      } else {
        // Usar 100 como padrão quando não houver código válido do usuário
        // Baseado no sistema antigo que usa codigoAgencia: 100 para "Vendas"
        requestData.codAgencia = 100;
      }

      // Incluir locadoras se fornecidas
      if (locadoras && locadoras.length > 0) {
        requestData.locadoras = locadoras;
      }

      const response = await apiService.getLocations(requestData);

      // Retornar dados com erros se houver
      const result: LocationsResponse['dados'] & { errors?: unknown[] } = {
        ...response.dados,
      };
      
      if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
        result.errors = response.errors;
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  /**
   * Verifica veículos disponíveis para os locais e datas selecionados
   */
  async verifyAvailableCars(
    codigoAgencia: number,
    data: VerifyAvailableCarsRequest
  ): Promise<AvailableCarsResponse['dados']> {
    try {
      const response = await apiService.verifyAvailableCars(codigoAgencia, data);
      return response.dados;
    } catch (error) {
      console.error('Error verifying available cars:', error);
      throw error;
    }
  }

  /**
   * Filtra parcerias por texto de busca
   */
  filterPartners(partners: Partner[], search: string): Partner[] {
    if (!search || search.length < 1) return [];
    
    const searchLower = search.toLowerCase();
    return partners.filter((partner) =>
      partner.descricao.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Agrupa franquias KM por categoria
   */
  groupFranchiseKmByCategory(list: Partner[]): Record<string, Partner[]> {
    const grouped: Record<string, Partner[]> = {};

    list.forEach((item) => {
      const category = item.categoria;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  }

  /**
   * Determina o tipo de locação baseado nas seleções
   */
  getRentalType(selectedPartner: Partner | null, dateDiff: number, rangeDayMonthly?: number): string {
    if (selectedPartner) {
      return 'Parcerias';
    }
    if (rangeDayMonthly && dateDiff >= rangeDayMonthly) {
      return 'Mensal Flex';
    }
    return 'Eventual';
  }
}

export const localizationService = new LocalizationService();
export default localizationService;

