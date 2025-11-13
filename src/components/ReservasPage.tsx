import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { apiService, type Booking } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import BookingItem from './BookingItem';
import './ReservasPage.scss';

const ReservasPage: React.FC = () => {
  const { user } = useAuth();
  const toast = React.useRef<Toast>(null);
  const [searchDoc, setSearchDoc] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customer, setCustomer] = useState<Booking['cliente'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const agencyCode = (user && 'id_carrental' in user ? (user.id_carrental as number) : 100) || 100;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchDoc.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, digite o CPF ou código da reserva.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.listBookings(agencyCode, searchDoc.trim());
      
      if (response.dados && response.dados.length > 0) {
        setBookings(response.dados);
        // Pegar dados do cliente da última reserva
        if (response.dados[response.dados.length - 1].cliente) {
          setCustomer(response.dados[response.dados.length - 1].cliente);
        }
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${response.dados.length} reserva(s) encontrada(s).`,
        });
      } else {
        setBookings([]);
        setCustomer(null);
        toast.current?.show({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Nenhuma reserva encontrada.',
        });
      }
    } catch (error: unknown) {
      console.error('Error searching bookings:', error);
      setBookings([]);
      setCustomer(null);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar reservas.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage.includes('404') ? 'Reserva não encontrada.' : errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (searchDoc.trim()) {
      handleSearch(new Event('submit') as unknown as React.FormEvent);
    }
  };

  return (
    <div className="reservas-page">
      <Toast ref={toast} />
      <div className="reservas-content">
        <div className="reservas-header">
          <h1>Reservas</h1>
        </div>

        <form className="reservas-search-form" onSubmit={handleSearch}>
          <div className="search-box">
            <label htmlFor="searchDoc" className="form-label">
              Reserva ou CPF
            </label>
            <div className="search-input-group">
              <InputText
                id="searchDoc"
                value={searchDoc}
                onChange={(e) => setSearchDoc(e.target.value)}
                placeholder="Digite o CPF ou código da reserva"
                className="search-input"
                disabled={isLoading}
              />
              <Button
                type="submit"
                label="Buscar"
                icon="pi pi-search"
                loading={isLoading}
                disabled={isLoading || !searchDoc.trim()}
                className="search-button"
              />
            </div>
          </div>
        </form>

        {customer && (
          <div className="customer-data">
            <h3 className="subtitle">Dados do cliente</h3>
            <ul className="data-list">
              <li>
                <strong>Nome:</strong>{' '}
                {customer.nomeCompleto || customer.name || 'N/A'}
              </li>
              <li>
                <strong>E-mail:</strong> {customer.email || 'N/A'}
              </li>
              <li>
                <strong>Celular:</strong>{' '}
                {customer.tel || (customer.ddd && customer.telefone ? `${customer.ddd}${customer.telefone}` : 'N/A')}
              </li>
            </ul>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="bookings-list">
            <h3 className="subtitle">
              Reservas encontradas: <strong>{bookings.length}</strong>
            </h3>
            <div className="booking-items">
              {bookings.map((booking, index) => (
                <BookingItem
                  key={booking.reservaId || index}
                  booking={booking}
                  onRefresh={handleRefresh}
                  agencyCode={agencyCode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasPage;

