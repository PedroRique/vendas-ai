import React from 'react';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import type { Car } from '../hooks/useCarFilters';
import './CarDetailsModal.scss';

interface CarDetailsModalProps {
  visible: boolean;
  car: Car | null;
  onHide: () => void;
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  visible,
  car,
  onHide,
}) => {
  if (!car) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const header = (
    <div className="modal-header">
      <h2>Períodos - {car.dadosVeiculo.modelo}</h2>
    </div>
  );

  const formatPeriodo = (periodo: string): string => {
    return periodo.replace('meses', 'mês').replace('e', 'ê');
  };

  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={onHide}
      className="car-details-modal"
      style={{ width: '90vw', maxWidth: '810px' }}
      maximizable
      blockScroll
    >
      {car.disponibilidadeFranquia?.periodos && (
        <TabView>
          {car.disponibilidadeFranquia.periodos.map((periodo, index) => (
            <TabPanel
              key={index}
              header={formatPeriodo(periodo.periodo)}
              leftIcon="pi pi-calendar"
            >
              <div className="period-details">
                <div className="detail-item">
                  <p>
                    <strong>Período de:</strong>
                  </p>
                  <p>
                    {formatPeriodo(periodo.periodo)} ({periodo.dias} Dias)
                  </p>
                </div>

                <div className="detail-item">
                  <p>
                    <strong>Valor total no período de:</strong>
                  </p>
                  <p>
                    {formatCurrency(periodo.valorTotalMensal)} (+ taxa
                    administrativa, quilometragem e proteção básica)
                  </p>
                </div>

                <div className="detail-item">
                  <p>
                    <strong>Valor diária:</strong>
                  </p>
                  <p>{formatCurrency(periodo.taxaMensal)}</p>
                </div>

                <div className="detail-item">
                  <p>
                    <strong>Total no período:</strong>
                  </p>
                  <p className="total-price">{formatCurrency(periodo.valorDiaria)}</p>
                </div>
              </div>
            </TabPanel>
          ))}
        </TabView>
      )}

      {!car.disponibilidadeFranquia?.periodos && (
        <div className="no-periods">
          <p>Informações de períodos não disponíveis para este veículo.</p>
        </div>
      )}
    </Dialog>
  );
};

export default CarDetailsModal;

