import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import type { Protection } from './ProtectionsPage';
import type { PersonalData } from './PersonalDataPage';
import Sidebar from './Sidebar';
import './FinalizationPage.scss';

interface BookingData {
  codigoReservaAgencia?: string;
  codigoReserva?: string;
  booking?: {
    bookingCode?: string;
  };
  [key: string]: unknown;
}

interface FinalizationPageProps {
  selectedCar: Car;
  booking: BookingData;
  accessories: Accessory[];
  protections: Protection[];
  personalData: PersonalData;
  pickupPlaceName?: string;
  returnPlaceName?: string;
  onAbort?: () => void;
  onRestart?: () => void;
}

const FinalizationPage: React.FC<FinalizationPageProps> = ({
  selectedCar,
  booking,
  accessories,
  protections,
  personalData,
  pickupPlaceName,
  returnPlaceName,
  onAbort,
  onRestart,
}) => {
  const toast = React.useRef<Toast>(null);

  const handleCopyReservation = (reservationNumber: string) => {
    let texto = `Acabamos de cadastrar sua reserva. Este é o seu código: ${reservationNumber}`;
    texto += `\nEnviaremos também para o seu celular um SMS com o código da sua reserva (${reservationNumber}), as informações e status de confirmação foram direcionadas para seu e-mail.`;
    texto += `\nFique atento às datas e horários de retirada/devolução do veículo, assim como os valores de coparticipação de franquia.`;
    texto += `\nQualquer dúvida ou para mais informações, estamos à disposição através do nosso chat, whatsapp ou 0800 606 8686.`;

    navigator.clipboard.writeText(texto).then(() => {
      toast.current?.show({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Copiado para área de transferência.',
      });
    }).catch(() => {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível copiar para a área de transferência.',
      });
    });
  };

  const reservationNumber = booking.codigoReservaAgencia || booking.codigoReserva || booking.booking?.bookingCode || '';

  return (
    <div className="finalization-page">
      <Toast ref={toast} />
      <div className="finalization-container">
        <div className="order-info">
          <Card className="finalization-card">
            <h1 className="main-title">Reserva foi concluída com sucesso</h1>
            
            {reservationNumber && (
              <div className="order-box">
                <div className="reservation-code">
                  <span className="number">{reservationNumber}</span>
                  <Button
                    icon="pi pi-copy"
                    className="p-button-text p-button-sm copy-button"
                    onClick={() => handleCopyReservation(reservationNumber)}
                    tooltip="Copiar código"
                    tooltipOptions={{ position: 'top' }}
                  />
                </div>
              </div>
            )}

            <p className="sms">
              Enviamos um SMS e um Email com todos os detalhes da sua reserva.
            </p>

            <div className="footer">
              <Button
                type="button"
                label="Encerrar"
                icon="pi pi-times"
                severity="secondary"
                onClick={onAbort}
              />
              {onRestart && (
                <Button
                  type="button"
                  label="Nova Reserva"
                  icon="pi pi-refresh"
                  onClick={onRestart}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      <Sidebar
        selectedCar={selectedCar}
        localizationData={{
          pickupPlaceName,
          returnPlaceName,
        }}
        accessories={accessories}
        protections={protections}
        personalData={personalData}
      />
    </div>
  );
};

export default FinalizationPage;

