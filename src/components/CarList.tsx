import React from 'react';
import CarCard from './CarCard';
import type { Car } from '../hooks/useCarFilters';
import './CarList.scss';

interface CarListProps {
  cars: Car[];
  selectedCar: Car | null;
  onSelectCar: (car: Car) => void;
  onCopyCar: (car: Car) => void;
  onViewDetails?: (car: Car) => void;
  rentalType?: string;
  franchiseKm?: string;
}

const CarList: React.FC<CarListProps> = ({
  cars,
  selectedCar,
  onSelectCar,
  onCopyCar,
  onViewDetails,
  rentalType,
  franchiseKm,
}) => {
  const formatCarData = (car: Car): string => {
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    let texto = car.vehicleData.model;

    if (!car.vehicleData.isMonthly) {
      texto += `\nDiária: ${formatCurrency(car.vehicleData.dailyValue)}`;
      texto += `\nTotal de diárias: ${car.vehicleData.numberOfDays}`;
      texto += `\nValor total: ${formatCurrency(car.vehicleData.totalValue)} já com todas as taxas, quilometragem livre e proteção básica incluídos.`;
      texto += '\nO valor das diárias pode ser parcelado em até 3x, sem acréscimos ou de 4x a 12x, com pequenos acréscimos, para facilitar ainda mais o seu planejamento.';
      texto += `\nLembrando que será necessário apresentar um cartão de crédito no momento da retirada do veículo, com ${formatCurrency(car.vehicleData.totalDepositValue)} de disponibilidade para garantia (caução).`;
      texto += '\nFazendo a reserva agora você garante o preço e a disponibilidade do carro.';
      texto += '\nVamos reservar?';
    } else {
      texto += `\nDiária: ${formatCurrency(car.vehicleData.dailyValue)}`;
      texto += `\nTotal de diárias: ${car.vehicleData.numberOfDays}`;
      texto += `\nValor total: ${formatCurrency(car.vehicleData.totalValue)} já com todas as taxas, e quilometragem no valor de ${franchiseKm || 'N/A'} KM e proteção básica incluídos`;
      
      // Note: disponibilidadeFranquia não existe mais na nova API, mas mantido para compatibilidade
      if ((car as any).disponibilidadeFranquia?.periodos) {
        texto += '\n' + formatPeriods((car as any).disponibilidadeFranquia.periodos);
      }
      
      texto += '\nReservas mensais parcelamos apenas em 3x sem juros.';
      texto += `\nLembrando que será necessário apresentar um cartão de crédito no momento da retirada do veículo, com ${formatCurrency(car.vehicleData.totalDepositValue)} de disponibilidade para garantia (caução).`;
      texto += '\nFazendo a reserva agora você garante o preço e a disponibilidade do carro.';
      texto += '\nVamos reservar?';
    }

    return texto;
  };

  const formatPeriods = (periods: Array<{
    periodo: string;
    dias: number;
    valorTotalMensal: number;
    taxaMensal: number;
    valorDiaria: number;
  }>): string => {
    if (!periods || periods.length === 0) return '';
    
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    return periods.map(p => {
      const periodo = p.periodo.replace('meses', 'mês').replace('e', 'ê');
      return `\n${periodo} por ${formatCurrency(p.valorTotalMensal)} e ${p.dias} dias de ${formatCurrency(p.taxaMensal)} diários, totalizando ${formatCurrency(p.valorDiaria)}`;
    }).join('');
  };

  const handleCopy = (car: Car) => {
    const text = formatCarData(car);
    navigator.clipboard.writeText(text).then(() => {
      // Toast será mostrado pelo componente pai
      onCopyCar(car);
    }).catch(() => {
      // Fallback para navegadores antigos
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onCopyCar(car);
    });
  };

  if (cars.length === 0) {
    return (
      <div className="car-list-empty">
        <p>Nenhum veículo encontrado com os filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="car-list">
      <h4 className="car-list-title">
        Resultados da busca: <strong>{cars.length}</strong>
      </h4>
      <div className="car-list-container">
        {cars.map((car, index) => (
          <CarCard
            key={`${car.vehicleData.vehicleGroupAcronym}-${car.rentalCompanyId || 0}-${index}`}
            car={car}
            isSelected={selectedCar === car}
            onSelect={onSelectCar}
            onCopy={handleCopy}
            onViewDetails={onViewDetails}
            rentalType={rentalType}
            franchiseKm={franchiseKm}
          />
        ))}
      </div>
    </div>
  );
};

export default CarList;

