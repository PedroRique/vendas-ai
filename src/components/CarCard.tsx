import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';
import type { Car } from '../hooks/useCarFilters';
import './CarCard.scss';

interface CarCardProps {
  car: Car;
  isSelected: boolean;
  onSelect: (car: Car) => void;
  onCopy: (car: Car) => void;
  onViewDetails?: (car: Car) => void;
  rentalType?: string;
  franchiseKm?: string;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  isSelected,
  onSelect,
  onCopy,
  onViewDetails,
  rentalType: _rentalType,
  franchiseKm,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const dailyPrice = car.dadosVeiculo.valorTotal / car.dadosVeiculo.quantidadeDiarias;

  const handleCopy = () => {
    onCopy(car);
  };

  const handleSelect = () => {
    if (!isSelected) {
      onSelect(car);
    }
  };

  const header = (
    <div className="car-card-header">
      <div className={`car-logo ${car.dadosVeiculo.nomeAgencia?.toLowerCase()}`}>
        <span>{car.dadosVeiculo.nomeAgencia}</span>
      </div>
      <div className="car-info-header">
        <h2 className="car-model">
          {car.dadosVeiculo.modelo}
          <Tooltip target=".info-tooltip" />
          <i className="pi pi-info-circle info-tooltip" data-pr-tooltip="O modelo é apenas uma referência para o grupo, a locadora poderá entregar outro modelo com características semelhantes." />
        </h2>
        <p className="car-category">{car.dadosVeiculo.grupoVeiculo}</p>
      </div>
      <Button
        icon="pi pi-copy"
        className="copy-button"
        rounded
        text
        severity="secondary"
        onClick={handleCopy}
        title="Copiar dados para área de transferência"
      />
    </div>
  );

  return (
    <Card className={`car-card ${isSelected ? 'selected' : ''}`} header={header}>
      <div className="car-card-content">
        <div className="car-image-section">
          <img
            src={car.dadosVeiculo.urlImagem || '/placeholder-car.png'}
            alt={car.dadosVeiculo.modelo}
            className="car-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-car.png';
            }}
          />
        </div>

        <div className="car-details-section">
          {!isSelected && (
            <>
              <div className="detail-row">
                <p>
                  <strong>Local de retirada:</strong>
                  <br />
                  {car.pesquisaLocacao.localRetiradaNome}
                </p>
              </div>
              <div className="detail-row">
                <p>
                  <strong>Local devolução:</strong>
                  <br />
                  {car.pesquisaLocacao.localDevolucaoNome}
                </p>
              </div>
              <div className="detail-row">
                <p>
                  <strong>Valores:</strong>
                  <br />
                  <strong>Caução:</strong> {formatCurrency(car.dadosVeiculo.valorTotalCalcao)} •{' '}
                  <strong>Franquia:</strong> {formatCurrency(car.dadosVeiculo.valorTotalFranquia)}
                </p>
              </div>
              {car.dadosVeiculo.ehMensal && car.disponibilidadeFranquia && (
                <div className="detail-row">
                  <p>
                    <strong>Diárias:</strong>
                    <br />
                    {car.dadosVeiculo.quantidadeDiarias}
                  </p>
                  <p>
                    <strong>Período de:</strong>
                    <br />
                    {car.disponibilidadeFranquia.periodos.length} Meses
                  </p>
                  {onViewDetails && (
                    <Button
                      label="Mais detalhes sobre períodos"
                      link
                      onClick={() => onViewDetails(car)}
                      className="details-link"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className={`car-price-section ${car.dadosVeiculo.ehMensal ? 'monthly' : ''}`}>
          <p className="price-total">{formatCurrency(car.dadosVeiculo.valorTotal)}</p>
          <p className="price-daily">{formatCurrency(dailyPrice)}/dia</p>
          <span className="installment-info">ou até 10x no cartão</span>
          {isSelected ? (
            <Button
              label="Cancelar"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => onSelect(car)}
            />
          ) : (
            <Button
              label="Reservar"
              icon="pi pi-check"
              onClick={handleSelect}
            />
          )}
        </div>
      </div>

      <div className="car-attributes">
        <span>
          <i className="pi pi-car" />
          Tanque cheio
        </span>
        {car.dadosVeiculo.capacidadeMala > 0 && (
          <span>
            <i className="pi pi-briefcase" />
            {car.dadosVeiculo.capacidadeMala} malas
          </span>
        )}
        {car.dadosVeiculo.ehMensal && franchiseKm && (
          <span>
            <i className="pi pi-map-marker" />
            Franquia Mensal {franchiseKm} KM
          </span>
        )}
      </div>
    </Card>
  );
};

export default CarCard;

