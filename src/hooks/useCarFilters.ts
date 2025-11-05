import { useState, useMemo, useCallback } from 'react';

// Tipos baseados na estrutura do sistema antigo
export interface CarFilter {
  name: string;
  description: string;
  value: string | number | boolean;
  featured?: boolean;
  disabled?: boolean;
}

export interface Car {
  dadosVeiculo: {
    modelo: string;
    grupoVeiculo: string;
    urlImagem: string;
    nomeAgencia: string;
    lugares: number;
    cambioAutomatico: boolean;
    arCondicionado: boolean;
    numeroPortas: number;
    capacidadeMala: number;
    valorTotal: number;
    valorDiaria: number;
    valorPorDia: number;
    valorTotalCalcao: number;
    valorTotalFranquia: number;
    quantidadeDiarias: number;
    status: string;
    codigoAcriss: string;
    codigoAgencia: number;
    ehMensal: boolean;
    valorDiariaTotalMensal?: number;
    valorTaxaRetorno?: number;
    [key: string]: unknown;
  };
  pesquisaLocacao: {
    localRetiradaNome: string;
    localDevolucaoNome: string;
  };
  disponibilidadeFranquia?: {
    periodos: Array<{
      periodo: string;
      dias: number;
      valorTotalMensal: number;
      taxaMensal: number;
      valorDiaria: number;
    }>;
  };
  dadosProtecoes?: Array<{
    codigoProtecao: string;
    nome: string;
    descricao?: string;
    obrigatorio: boolean;
    valorTotal: number;
    valorDiaria: number;
    ordenacao?: number;
    sigla?: string;
    [key: string]: unknown;
  }>;
  dadosOpcionais?: Array<{
    nome: string;
    valorDiaria: number;
    valorTotal: number;
    quantidade?: number;
    quantidadeMaxima?: number;
    quantidadeMaximaDiariasSerCobrado?: number;
    obrigatorio?: boolean;
    selected?: boolean;
    [key: string]: unknown;
  }>;
  selected?: boolean;
  [key: string]: unknown;
}

interface PriceRange {
  min: number;
  max: number;
}

interface ActiveFilters {
  lugares?: number;
  cambioAutomatico?: boolean;
  arCondicionado?: boolean;
  numeroPortas?: number;
  nomeAgencia?: string[];
  [key: string]: unknown;
}

export interface UseCarFiltersReturn {
  filteredCars: Car[];
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  activeFilters: ActiveFilters;
  toggleFilter: (filter: CarFilter) => void;
  clearFilters: () => void;
  availableLocadoras: string[];
}

export const useCarFilters = (cars: Car[]): UseCarFiltersReturn => {
  // Filtrar apenas carros disponíveis
  const availableCars = useMemo(() => {
    return cars.filter((car) => car.dadosVeiculo.status === 'Available');
  }, [cars]);

  // Calcular range de preços
  const initialPriceRange = useMemo(() => {
    if (availableCars.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = availableCars.map((car) => car.dadosVeiculo.valorTotal);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [availableCars]);

  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  // Obter locadoras únicas disponíveis
  const availableLocadoras = useMemo(() => {
    const locadoras = new Set<string>();
    availableCars.forEach((car) => {
      if (car.dadosVeiculo.nomeAgencia) {
        locadoras.add(car.dadosVeiculo.nomeAgencia);
      }
    });
    return Array.from(locadoras).sort();
  }, [availableCars]);

  // Aplicar filtros
  const filteredCars = useMemo(() => {
    let filtered = [...availableCars];

    // Filtro de preço
    filtered = filtered.filter((car) => {
      const price = car.dadosVeiculo.valorTotal;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Filtros de características
    if (activeFilters.lugares !== undefined) {
      filtered = filtered.filter(
        (car) => car.dadosVeiculo.lugares > activeFilters.lugares!
      );
    }

    if (activeFilters.cambioAutomatico !== undefined) {
      filtered = filtered.filter(
        (car) => car.dadosVeiculo.cambioAutomatico === activeFilters.cambioAutomatico
      );
    }

    if (activeFilters.arCondicionado !== undefined) {
      filtered = filtered.filter(
        (car) => car.dadosVeiculo.arCondicionado === activeFilters.arCondicionado
      );
    }

    if (activeFilters.numeroPortas !== undefined) {
      filtered = filtered.filter(
        (car) => car.dadosVeiculo.numeroPortas === activeFilters.numeroPortas
      );
    }

    // Filtro de locadoras (múltipla seleção)
    if (activeFilters.nomeAgencia && activeFilters.nomeAgencia.length > 0) {
      filtered = filtered.filter((car) =>
        activeFilters.nomeAgencia!.includes(car.dadosVeiculo.nomeAgencia)
      );
    }

    return filtered;
  }, [availableCars, priceRange, activeFilters]);

  const toggleFilter = useCallback((filter: CarFilter) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      switch (filter.name) {
        case 'lugares':
          if (newFilters.lugares === filter.value) {
            delete newFilters.lugares;
          } else {
            newFilters.lugares = filter.value as number;
          }
          break;

        case 'cambioAutomatico':
          if (newFilters.cambioAutomatico === filter.value) {
            delete newFilters.cambioAutomatico;
          } else {
            newFilters.cambioAutomatico = filter.value as boolean;
          }
          break;

        case 'arCondicionado':
          if (newFilters.arCondicionado === filter.value) {
            delete newFilters.arCondicionado;
          } else {
            newFilters.arCondicionado = filter.value as boolean;
          }
          break;

        case 'numeroPortas':
          // Para portas, só pode selecionar uma opção por vez
          if (newFilters.numeroPortas === filter.value) {
            delete newFilters.numeroPortas;
          } else {
            newFilters.numeroPortas = filter.value as number;
          }
          break;

        case 'nomeAgencia':
          if (!newFilters.nomeAgencia) {
            newFilters.nomeAgencia = [];
          }
          const index = newFilters.nomeAgencia.indexOf(filter.value as string);
          if (index > -1) {
            newFilters.nomeAgencia = newFilters.nomeAgencia.filter(
              (item) => item !== filter.value
            );
            if (newFilters.nomeAgencia.length === 0) {
              delete newFilters.nomeAgencia;
            }
          } else {
            newFilters.nomeAgencia = [...newFilters.nomeAgencia, filter.value as string];
          }
          break;
      }

      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setPriceRange(initialPriceRange);
  }, [initialPriceRange]);

  return {
    filteredCars,
    priceRange,
    setPriceRange,
    activeFilters,
    toggleFilter,
    clearFilters,
    availableLocadoras,
  };
};

