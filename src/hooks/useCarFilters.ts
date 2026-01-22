import { useState, useMemo, useCallback } from 'react';
import type { AvailableVehicle } from '../services/api';

// Tipos baseados na estrutura do sistema antigo
export interface CarFilter {
  name: string;
  description: string;
  value: string | number | boolean;
  featured?: boolean;
  disabled?: boolean;
}

// Car type now uses English property names from AvailableVehicle
export type Car = AvailableVehicle & {
  selected?: boolean;
  rentalCompanyId?: number;
  rentalCompanyName?: string;
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
  // Filter only available cars
  const availableCars = useMemo(() => {
    return cars.filter((car) => car.vehicleData.totalValue > 0);
  }, [cars]);

  // Calculate price range
  const initialPriceRange = useMemo(() => {
    if (availableCars.length === 0) {
      return { min: 0, max: 0 };
    }
    const prices = availableCars.map((car) => car.vehicleData.totalValue);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [availableCars]);

  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  // Get unique rental companies available
  const availableLocadoras = useMemo(() => {
    const locadoras = new Set<string>();
    availableCars.forEach((car) => {
      if (car.rentalCompanyName) {
        locadoras.add(car.rentalCompanyName);
      }
    });
    return Array.from(locadoras).sort();
  }, [availableCars]);

  // Apply filters
  const filteredCars = useMemo(() => {
    let filtered = [...availableCars];

    // Price filter
    filtered = filtered.filter((car) => {
      const price = car.vehicleData.totalValue;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Feature filters
    if (activeFilters.lugares !== undefined) {
      filtered = filtered.filter(
        (car) => car.vehicleData.numberOfSeats > activeFilters.lugares!
      );
    }

    if (activeFilters.cambioAutomatico !== undefined) {
      filtered = filtered.filter(
        (car) => car.vehicleData.isAutomaticTransmission === activeFilters.cambioAutomatico
      );
    }

    if (activeFilters.arCondicionado !== undefined) {
      filtered = filtered.filter(
        (car) => car.vehicleData.hasAirConditioning === activeFilters.arCondicionado
      );
    }

    if (activeFilters.numeroPortas !== undefined) {
      filtered = filtered.filter(
        (car) => car.vehicleData.numberOfDoors === activeFilters.numeroPortas
      );
    }

    // Rental company filter (multiple selection)
    if (activeFilters.nomeAgencia && activeFilters.nomeAgencia.length > 0) {
      filtered = filtered.filter((car) =>
        car.rentalCompanyName && activeFilters.nomeAgencia!.includes(car.rentalCompanyName)
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

