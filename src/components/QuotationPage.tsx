import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { apiService } from '../services/api';
import type { QuotationRequest } from '../services/api';
import { formatBooking } from '../utils/formatBooking';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import type { Protection } from './ProtectionsPage';
import type { PersonalData } from './PersonalDataPage';
import Sidebar from './Sidebar';
import './QuotationPage.scss';

interface LocalizationData {
  localization: Record<string, unknown>;
  accessories?: Accessory[];
  protection?: Protection[];
  personal?: PersonalData;
  [key: string]: unknown;
}

interface QuotationPageProps {
  selectedCar: Car;
  localizationData: LocalizationData;
  accessories: Accessory[];
  protections: Protection[];
  personalData: PersonalData;
  protocolo: string;
  agencyCode: number;
  onSuccess?: () => void; // Quando envia cotação e depois finaliza
  onAbort?: () => void;
}

const QuotationPage: React.FC<QuotationPageProps> = ({
  selectedCar,
  localizationData,
  accessories,
  protections,
  personalData,
  protocolo,
  agencyCode,
  onSuccess: _onSuccess,
  onAbort,
}) => {
  const toast = React.useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      // Construir pesquisaLocacao com os dados necessários
      const locData = localizationData.localization as any;
      const selectedCarWithLoc = {
        ...selectedCar,
        pesquisaLocacao: {
          ...selectedCar.pesquisaLocacao,
          dataHoraDevolucao: locData.dataHoraDevolucao || '',
          dataHoraRetirada: locData.dataHoraRetirada || '',
          localRetiradaSigla: locData.locaisRetirada?.[0] || selectedCar.pesquisaLocacao.localRetiradaNome || '',
          localDevolucaoSigla: locData.locaisDevolucao?.[0] || selectedCar.pesquisaLocacao.localDevolucaoNome || '',
        },
      };

      const bookingData = formatBooking(
        {
          selectedCar: selectedCarWithLoc,
          personal: {
            ...personalData,
            documentType: personalData.documentType || 1, // Default to CPF if not set
          },
          accessories,
          protection: protections,
          localization: localizationData.localization as Record<string, unknown>,
          id_attendance: protocolo,
          id_carrental: agencyCode,
        },
        true // isQuotation
      ) as QuotationRequest;

      await apiService.quotation(agencyCode, bookingData);
      
      setShowEmailDialog(true);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cotação enviada com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao enviar cotação:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: error.message || 'Não foi possível enviar a cotação.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowEmailDialog(false);
  };

  const handleAbort = () => {
    if (onAbort) {
      onAbort();
    }
  };

  return (
    <div className="quotation-page sidebar-container -with-quotation-sidebar">
      <Toast ref={toast} />
      <Card className="quotation-card">
        <div className="quotation-header">
          <h1 className="main-title">Cotação gerada com sucesso</h1>
        </div>

        <div className="quotation-footer">
          <Button
            type="button"
            label="Encerrar"
            icon="pi pi-times"
            severity="secondary"
            onClick={handleAbort}
            disabled={isLoading}
          />
          <Button
            type="button"
            label="Enviar"
            icon="pi pi-send"
            severity="info"
            onClick={handleSendEmail}
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </Card>

      <Sidebar
        selectedCar={selectedCar}
        localizationData={localizationData}
        accessories={accessories}
        protections={protections}
        personalData={personalData}
        quotation={true}
      />

      {/* Dialog de confirmação de email */}
      <Dialog
        header="Cotação enviada com sucesso!"
        visible={showEmailDialog}
        style={{ width: '50vw' }}
        onHide={handleCloseDialog}
        modal
        draggable={false}
        resizable={false}
      >
        <p>
          A cotação foi enviada para {personalData.name} no email {personalData.email}
        </p>
        <div className="dialog-footer">
          <Button
            label="Fechar"
            icon="pi pi-check"
            onClick={handleCloseDialog}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default QuotationPage;

