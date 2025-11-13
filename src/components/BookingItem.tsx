import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { apiService, type Booking, type CancellationReason } from '../services/api';
import CancelBookingModal from './CancelBookingModal';
import UpdateBookingModal from './UpdateBookingModal';
import dayjs from 'dayjs';
import './BookingItem.scss';

interface BookingItemProps {
  booking: Booking;
  onRefresh: () => void;
  agencyCode: number;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, onRefresh, agencyCode }) => {
  const toast = React.useRef<Toast>(null);
  const [isDownloadingLogs, setIsDownloadingLogs] = useState(false);
  const [isResendingVoucher, setIsResendingVoucher] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const canEditOrCancel = booking.statusReserva.nome === 'Booked' || booking.statusReserva.nome === 'Confirmada';
  const bookingCode = booking.codigoReservaAgencia || booking.codigoReserva;

  const handleDownloadLogs = async () => {
    setIsDownloadingLogs(true);
    try {
      const blob = await apiService.getLogFile(bookingCode);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookingCode}_logs.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Logs baixados com sucesso.',
      });
    } catch (error: unknown) {
      console.error('Error downloading logs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao baixar logs.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage.includes('404') ? 'Logs da reserva não encontrados.' : errorMessage,
      });
    } finally {
      setIsDownloadingLogs(false);
    }
  };

  const handleResendVoucher = async () => {
    setIsResendingVoucher(true);
    try {
      await apiService.resendVoucher(bookingCode);
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Voucher reenviado com sucesso.',
      });
    } catch (error: unknown) {
      console.error('Error resending voucher:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reenviar voucher.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsResendingVoucher(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="booking-item">
        <div className="booking-header">
          <ul className="status-list">
            <li>
              Nº da reserva: <strong>{bookingCode}</strong>
            </li>
            <li>
              Retirada: <strong>{formatDate(booking.dataRetirada)}</strong>
            </li>
            <li>
              Devolução: <strong>{formatDate(booking.dataDevolucao)}</strong>
            </li>
            <li>
              Status: <strong>{booking.statusReserva.nome}</strong>
            </li>
          </ul>
        </div>

        <div className="booking-content">
          <div className="booking-left">
            <ul>
              <li>
                Modelo: <strong>{booking.grupoVeiculo}</strong>
              </li>
              <li>
                Retirada: <strong>{booking.lojaRetirada.nome}</strong>
              </li>
              <li>
                Entrega: <strong>{booking.lojaDevolucao.nome}</strong>
              </li>
              <li>
                Locadora: <strong>{booking.lojaRetirada.agencia.nome}</strong>
              </li>
            </ul>
          </div>

          <div className="booking-right">
            <div className="booking-price">
              <p className="price">{formatCurrency(booking.valorTotalApurado)}</p>
              <p className="payment-card">ou até 10x no cartão</p>
            </div>
            <Button
              label="Baixar Logs"
              icon="pi pi-download"
              onClick={handleDownloadLogs}
              loading={isDownloadingLogs}
              disabled={isDownloadingLogs}
              className="btn-logs"
              severity="secondary"
              size="small"
            />
          </div>
        </div>

        {canEditOrCancel && (
          <div className="booking-footer">
            <Button
              label="Enviar Voucher"
              icon="pi pi-send"
              onClick={handleResendVoucher}
              loading={isResendingVoucher}
              disabled={isResendingVoucher}
              className="btn-voucher"
            />
            <Button
              label="Alterar"
              icon="pi pi-pencil"
              onClick={() => setShowUpdateModal(true)}
              className="btn-update"
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowCancelModal(true)}
              className="btn-cancel"
              severity="danger"
            />
          </div>
        )}
      </div>

      <CancelBookingModal
        visible={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        booking={booking}
        agencyCode={agencyCode}
        onSuccess={() => {
          setShowCancelModal(false);
          onRefresh();
        }}
      />

      <UpdateBookingModal
        visible={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        booking={booking}
        agencyCode={agencyCode}
        onSuccess={() => {
          setShowUpdateModal(false);
          onRefresh();
        }}
      />
    </>
  );
};

export default BookingItem;

