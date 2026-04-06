import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './BookingLoadingOverlay.scss';

interface BookingLoadingOverlayProps {
  visible: boolean;
}

const BookingLoadingOverlay: React.FC<BookingLoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="booking-loading-overlay">
      <div className="booking-loading-content">
        <ProgressSpinner style={{ width: '60px', height: '60px' }} />
        <h3>Processando reserva...</h3>
        <p>Por favor, aguarde enquanto finalizamos sua reserva.</p>
      </div>
    </div>
  );
};

export default BookingLoadingOverlay;
