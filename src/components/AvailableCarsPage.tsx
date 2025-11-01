import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useCarFilters, type Car, type CarFilter } from '../hooks/useCarFilters';
import CarFilters from './CarFilters';
import PriceFilter from './PriceFilter';
import CarList from './CarList';
import CarDetailsModal from './CarDetailsModal';
import './AvailableCarsPage.scss';

interface AvailableCarsPageProps {
  availabilityData: {
    veiculosDisponiveis: Car[];
    filtroValorReserva?: {
      minValorDisponibilidade: number;
      maxValorDisponibilidade: number;
    };
    [key: string]: unknown;
  };
  localizationData?: {
    rentalType?: string;
    franquiaKM?: { codigo: string };
    [key: string]: unknown;
  };
  onCarSelect: (car: Car) => void;
  onAbort?: () => void;
}

const AvailableCarsPage: React.FC<AvailableCarsPageProps> = ({
  availabilityData,
  localizationData,
  onCarSelect,
  onAbort,
}) => {
  const toast = React.useRef<Toast>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [carForDetails, setCarForDetails] = useState<Car | null>(null);

  const cars = useMemo(() => {
    return availabilityData.veiculosDisponiveis || [];
  }, [availabilityData]);

  const {
    filteredCars,
    priceRange,
    setPriceRange,
    activeFilters,
    toggleFilter,
    clearFilters,
    availableLocadoras,
  } = useCarFilters(cars);

  // Preparar filtros disponíveis
  const availableFilters: CarFilter[] = useMemo(() => [
    {
      name: 'lugares',
      description: 'Carros com mais de 5 lugares',
      value: 5,
      featured: true,
    },
    {
      name: 'cambioAutomatico',
      description: 'Somente carro automático',
      value: true,
      featured: true,
    },
  ], []);

  const characteristicFilters: CarFilter[] = useMemo(() => [
    {
      name: 'arCondicionado',
      description: 'Ar condicionado',
      value: true,
      featured: false,
    },
    {
      name: 'numeroPortas',
      description: '2 portas',
      value: 2,
      featured: false,
    },
    {
      name: 'numeroPortas',
      description: '4 portas',
      value: 4,
      featured: false,
    },
  ], []);

  const carrentalFilters: CarFilter[] = useMemo(() => {
    return availableLocadoras.map((locadora) => ({
      name: 'nomeAgencia',
      description: locadora,
      value: locadora,
      featured: false,
    }));
  }, [availableLocadoras]);

  // Calcular range de preços inicial
  const initialPriceRange = useMemo(() => {
    if (availabilityData.filtroValorReserva) {
      return {
        min: availabilityData.filtroValorReserva.minValorDisponibilidade,
        max: availabilityData.filtroValorReserva.maxValorDisponibilidade,
      };
    }

    if (filteredCars.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = filteredCars.map((car) => car.dadosVeiculo.valorTotal);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [availabilityData.filtroValorReserva, filteredCars]);

  useEffect(() => {
    setPriceRange(initialPriceRange);
  }, [initialPriceRange, setPriceRange]);

  const handleCarSelect = (car: Car) => {
    if (selectedCar === car) {
      // Deselecionar
      setSelectedCar(null);
    } else {
      // Selecionar novo carro
      setSelectedCar(car);
      onCarSelect(car);
      toast.current?.show({
        severity: 'success',
        summary: 'Veículo Selecionado',
        detail: `${car.dadosVeiculo.modelo} selecionado com sucesso.`,
      });
    }
  };

  const handleCopyCar = (car: Car) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Copiado',
      detail: 'Dados do veículo copiados para área de transferência.',
    });
  };

  const handleViewDetails = (car: Car) => {
    setCarForDetails(car);
    setDetailsModalVisible(true);
  };

  const handleAbort = () => {
    if (onAbort) {
      onAbort();
    }
  };

  const franchiseKm = localizationData?.franquiaKM?.codigo;

  return (
    <div className="available-cars-page">
      <Toast ref={toast} />
      <div className="page-layout">
        {/* Sidebar de Filtros */}
        <aside className="filters-sidebar">
          <CarFilters
            availableFilters={availableFilters}
            characteristicFilters={characteristicFilters}
            carrentalFilters={carrentalFilters}
            activeFilters={activeFilters}
            onFilterChange={toggleFilter}
          />
          <div className="sidebar-actions">
            <Button
              label="Encerrar"
              icon="pi pi-times"
              severity="secondary"
              onClick={handleAbort}
              className="abort-button"
            />
            {(Object.keys(activeFilters).length > 0 || 
              priceRange.min !== initialPriceRange.min || 
              priceRange.max !== initialPriceRange.max) && (
              <Button
                label="Limpar Filtros"
                icon="pi pi-filter-slash"
                severity="secondary"
                outlined
                onClick={clearFilters}
                className="clear-filters-button"
              />
            )}
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="main-content">
          <PriceFilter
            min={initialPriceRange.min}
            max={initialPriceRange.max}
            value={[priceRange.min, priceRange.max]}
            onChange={(range) => setPriceRange({ min: range[0], max: range[1] })}
          />

          <CarList
            cars={filteredCars}
            selectedCar={selectedCar}
            onSelectCar={handleCarSelect}
            onCopyCar={handleCopyCar}
            onViewDetails={handleViewDetails}
            rentalType={localizationData?.rentalType}
            franchiseKm={franchiseKm}
          />
        </main>
      </div>

      <CarDetailsModal
        visible={detailsModalVisible}
        car={carForDetails}
        onHide={() => setDetailsModalVisible(false)}
      />
    </div>
  );
};

export default AvailableCarsPage;

