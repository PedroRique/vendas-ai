import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { apiService } from '../services/api';
import './StartAttendanceModal.scss';

interface StartAttendanceModalProps {
  onClose: () => void;
  onSuccess: (protocolo: string) => void;
  agencyCode: number;
}

const StartAttendanceModal: React.FC<StartAttendanceModalProps> = ({
  onClose,
  onSuccess,
  agencyCode,
}) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const toast = React.useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Por favor, digite o token de atendimento.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.startAttendance({
        codigoAgencia: agencyCode,
        tokenAtendimento: token.trim(),
      });

      const protocolo = response.dados.toString();
      setToken('');
      onSuccess(protocolo);
      onClose();
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Atendimento iniciado com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao iniciar atendimento:', error);
      
      const errorMessage = error?.message || 'Erro ao validar o token. Verifique se o token está correto.';
      setError(errorMessage);
      
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setToken('');
    setError('');
    onClose();
  };

  return (
    <div className="start-attendance-page">
      <Toast ref={toast} />
      <div className="start-attendance-content">
        <div className="start-attendance-header">
          <h1>Token de Atendimento ao Cliente</h1>
        </div>

        <form onSubmit={handleSubmit} className="token-form">
          <div className="form-field">
            <label htmlFor="token" className="form-label">
              Token
            </label>
            <InputText
              id="token"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError('');
              }}
              placeholder="Digite o token de atendimento"
              className={error ? 'p-invalid' : ''}
              disabled={isLoading}
              autoFocus
              autoComplete="off"
            />
            {error && (
              <div className="input-error">
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="form-footer">
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              onClick={handleClose}
              severity="secondary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              label="Continuar"
              icon="pi pi-check"
              loading={isLoading}
              disabled={!token.trim() || isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartAttendanceModal;

