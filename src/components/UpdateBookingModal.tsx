import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { apiService, type Booking } from '../services/api';
import LocalizationForm from './LocalizationForm';
import './UpdateBookingModal.scss';

interface UpdateBookingModalProps {
  visible: boolean;
  onHide: () => void;
  booking: Booking;
  agencyCode: number;
  onSuccess: () => void;
}

const UpdateBookingModal: React.FC<UpdateBookingModalProps> = ({
  visible,
  onHide,
  booking,
  agencyCode,
  onSuccess,
}) => {
  const toast = React.useRef<Toast>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLocalizationSuccess = async (data: Record<string, unknown>) => {
    setIsUpdating(true);
    try {
      const localization = data.localization as Record<string, unknown>;
      const bookingCode = booking.codigoReservaAgencia || booking.codigoReserva;

      const updateData = {
        dataHoraRetirada: localization.dataHoraRetirada,
        dataHoraDevolucao: localization.dataHoraDevolucao,
        localRetirada: Array.isArray(localization.locaisRetirada)
          ? localization.locaisRetirada[0]
          : localization.locaisRetirada,
        localDevolucao: Array.isArray(localization.locaisDevolucao)
          ? localization.locaisDevolucao[0]
          : localization.locaisDevolucao,
      };

      await apiService.editBooking(agencyCode, bookingCode, updateData);

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Reserva alterada com sucesso.',
      });

      onSuccess();
    } catch (error: unknown) {
      console.error('Error updating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar reserva.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Alterar Reserva"
        visible={visible}
        onHide={onHide}
        style={{ width: '90vw', maxWidth: '1200px' }}
        modal
        className="update-booking-modal"
        maximizable
      >
        <div className="update-booking-content">
          <p className="booking-info">
            Alterando reserva: <strong>{booking.codigoReservaAgencia || booking.codigoReserva}</strong>
          </p>
          <LocalizationForm
            onSuccess={handleLocalizationSuccess}
            onAbort={onHide}
            agencyCode={agencyCode}
            protocolo={String(booking.reservaId)}
          />
        </div>
      </Dialog>
    </>
  );
};

export default UpdateBookingModal;

