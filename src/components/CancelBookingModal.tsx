import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { apiService, type Booking, type CancellationReason } from '../services/api';
import './CancelBookingModal.scss';

interface CancelBookingModalProps {
  visible: boolean;
  onHide: () => void;
  booking: Booking;
  agencyCode: number;
  onSuccess: () => void;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  visible,
  onHide,
  booking,
  agencyCode,
  onSuccess,
}) => {
  const toast = React.useRef<Toast>(null);
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);

  useEffect(() => {
    if (visible) {
      loadReasons();
    } else {
      // Reset form when modal closes
      setSelectedReason(null);
      setObservations('');
    }
  }, [visible]);

  const loadReasons = async () => {
    setIsLoadingReasons(true);
    try {
      const response = await apiService.getCancellationReasons();
      setReasons(response.dados || []);
    } catch (error) {
      console.error('Error loading cancellation reasons:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar os motivos de cancelamento.',
      });
    } finally {
      setIsLoadingReasons(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedReason) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, selecione um motivo de cancelamento.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const bookingCode = booking.codigoReservaAgencia || booking.codigoReserva;
      await apiService.cancelBooking(agencyCode, {
        codigoReserva: bookingCode,
        motivoCancelamento: selectedReason.codigo,
        observacoes: observations || undefined,
      });

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Reserva cancelada com sucesso.',
      });

      onSuccess();
    } catch (error: unknown) {
      console.error('Error canceling booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar reserva.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reasonOptions = reasons.map((reason) => ({
    label: reason.descricao,
    value: reason,
  }));

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Cancelar Reserva"
        visible={visible}
        onHide={onHide}
        style={{ width: '500px' }}
        modal
        className="cancel-booking-modal"
      >
        <div className="cancel-booking-content">
          <p>
            Tem certeza que deseja cancelar a reserva{' '}
            <strong>{booking.codigoReservaAgencia || booking.codigoReserva}</strong>?
          </p>

          <div className="form-field">
            <label htmlFor="reason" className="form-label">
              Motivo do cancelamento <span className="required">*</span>
            </label>
            <Dropdown
              id="reason"
              value={selectedReason}
              options={reasonOptions}
              onChange={(e) => setSelectedReason(e.value)}
              optionLabel="label"
              placeholder="Selecione o motivo"
              className="reason-dropdown"
              loading={isLoadingReasons}
              disabled={isLoadingReasons}
            />
          </div>

          <div className="form-field">
            <label htmlFor="observations" className="form-label">
              Observações
            </label>
            <InputTextarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Digite observações adicionais (opcional)"
              rows={4}
              className="observations-textarea"
            />
          </div>

          <div className="modal-footer">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={onHide}
              severity="secondary"
              disabled={isLoading}
            />
            <Button
              label="Confirmar Cancelamento"
              icon="pi pi-check"
              onClick={handleCancel}
              loading={isLoading}
              disabled={isLoading || !selectedReason}
              severity="danger"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CancelBookingModal;

