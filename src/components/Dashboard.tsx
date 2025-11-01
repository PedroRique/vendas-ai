import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAuth } from '../hooks/useAuth';
import LocalizationForm from './LocalizationForm';
import AvailableCarsPage from './AvailableCarsPage';
import AccessoriesPage from './AccessoriesPage';
import ProtectionsPage from './ProtectionsPage';
import PersonalDataPage from './PersonalDataPage';
import QuotationPage from './QuotationPage';
import FinalizationPage from './FinalizationPage';
import StartAttendanceModal from './StartAttendanceModal';
import { apiService } from '../services/api';
import type { BookingResponse } from '../services/api';
import { formatBooking } from '../utils/formatBooking';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import type { Protection } from './ProtectionsPage';
import './Dashboard.scss';

interface LocalizationFormData {
  localization: Record<string, unknown>;
  availability: {
    veiculosDisponiveis: Car[];
    filtroValorReserva?: {
      minValorDisponibilidade: number;
      maxValorDisponibilidade: number;
    };
    [key: string]: unknown;
  };
  rentalType: string;
  getCarPlace: Record<string, unknown>;
  retrievePlace: Record<string, unknown>;
}

interface PersonalData {
  cpf?: string;
  passport?: string;
  name: string;
  tel: string;
  email: string;
  customerId?: number;
  documentType?: number;
  foreigner?: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState<'localization' | 'cars' | 'accessories' | 'protections' | 'personal' | 'quotation' | 'finalization'>('localization');
  const [localizationData, setLocalizationData] = useState<LocalizationFormData | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [protections, setProtections] = useState<Protection[]>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [booking, setBooking] = useState<BookingResponse['dados'] | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false); // Modal fecha por padrão, abre quando usuário clica no botão

  const agencyCode = (user && 'id_carrental' in user ? (user.id_carrental as number) : 100) || 100;

  const handleTokenSuccess = (newProtocolo: string) => {
    setProtocolo(newProtocolo);
    setShowTokenModal(false);
  };

  const handleShowTokenModal = () => {
    setShowTokenModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLocalizationSuccess = (data: LocalizationFormData) => {
    console.log('Localization data:', data);
    setLocalizationData(data);
    setCurrentStep('cars');
  };

  const handleLocalizationAbort = () => {
    // Voltar para login ou limpar estado
    console.log('Localization form aborted');
  };

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setCurrentStep('accessories');
  };

  const handleCarsPageAbort = () => {
    // Voltar para formulário de localização
    setCurrentStep('localization');
  };

  const handleAccessoriesSuccess = (selectedAccessories: Accessory[]) => {
    setAccessories(selectedAccessories);
    setCurrentStep('protections');
  };

  const handleAccessoriesAbort = () => {
    // Voltar para seleção de carros
    setCurrentStep('cars');
  };

  const handleProtectionsSuccess = (selectedProtections: Protection[]) => {
    setProtections(selectedProtections);
    setCurrentStep('personal');
  };

  const handleProtectionsAbort = () => {
    // Voltar para seleção de acessórios
    setCurrentStep('accessories');
  };

  const handlePersonalDataSuccess = async (data: PersonalData, isNewCustomer: boolean) => {
    setPersonalData(data);
    
    // Salvar dados pessoais e fazer booking
    if (selectedCar && localizationData && protocolo) {
      try {
        const bookingData = formatBooking({
          selectedCar,
          personal: data,
          accessories,
          protection: protections,
          localization: localizationData.localization as Record<string, unknown>,
          id_attendance: protocolo,
          id_carrental: agencyCode,
        });

        const response = await apiService.booking(agencyCode, bookingData);
        setBooking(response.dados);
        setCurrentStep('finalization');
      } catch (error: any) {
        console.error('Erro ao finalizar reserva:', error);
        // Não navegar para finalização em caso de erro
      }
    }
  };

  const handlePersonalDataQuotation = async (data: PersonalData, isNewCustomer: boolean) => {
    // Salvar dados pessoais antes de ir para cotação
    setPersonalData(data);
    setCurrentStep('quotation');
  };

  const handlePersonalDataAbort = () => {
    // Voltar para seleção de proteções
    setCurrentStep('protections');
  };

  const handleQuotationSuccess = async () => {
    // Quando clica em "Finalizar" na cotação
    if (selectedCar && localizationData && personalData && protocolo) {
      try {
        const bookingData = formatBooking({
          selectedCar,
          personal: personalData,
          accessories,
          protection: protections,
          localization: localizationData.localization as Record<string, unknown>,
          id_attendance: protocolo,
          id_carrental: agencyCode,
        });

        const response = await apiService.booking(agencyCode, bookingData);
        setBooking(response.dados);
        setCurrentStep('finalization');
      } catch (error: any) {
        console.error('Erro ao finalizar reserva:', error);
      }
    }
  };

  const handleQuotationAbort = () => {
    setCurrentStep('personal');
  };

  const handleFinalizationAbort = () => {
    // Limpar estado e voltar ao início
    setLocalizationData(null);
    setSelectedCar(null);
    setAccessories([]);
    setProtections([]);
    setPersonalData(null);
    setBooking(null);
    setProtocolo(null);
    setCurrentStep('localization');
  };

  const handleFinalizationRestart = () => {
    // Nova reserva - limpar tudo exceto protocolo
    setLocalizationData(null);
    setSelectedCar(null);
    setAccessories([]);
    setProtections([]);
    setPersonalData(null);
    setBooking(null);
    setCurrentStep('localization');
  };

  if (currentStep === 'cars' && localizationData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header-bar">
          <h1>Sistema de Vendas</h1>
          <Button
            label="Sair"
            icon="pi pi-sign-out"
            onClick={handleLogout}
            severity="secondary"
            size="small"
          />
        </div>
        <AvailableCarsPage
          availabilityData={localizationData.availability}
          localizationData={{
            rentalType: localizationData.rentalType,
            franquiaKM: localizationData.localization.franquiaKM as { codigo: string } | undefined,
          }}
          onCarSelect={handleCarSelect}
          onAbort={handleCarsPageAbort}
        />
      </div>
    );
  }

  if (currentStep === 'accessories' && selectedCar && localizationData) {
    return (
      <div className="dashboard-container">
        <AccessoriesPage
          selectedCar={selectedCar}
          localizationData={{
            ...localizationData.localization,
            accessories,
          }}
          onSuccess={handleAccessoriesSuccess}
          onAbort={handleAccessoriesAbort}
        />
      </div>
    );
  }

  if (currentStep === 'protections' && selectedCar && localizationData) {
    return (
      <div className="dashboard-container">
        <ProtectionsPage
          selectedCar={selectedCar}
          localizationData={{
            ...localizationData.localization,
            accessories,
            protection: protections,
          }}
          accessories={accessories}
          onSuccess={handleProtectionsSuccess}
          onAbort={handleProtectionsAbort}
        />
      </div>
    );
  }

  if (currentStep === 'personal' && selectedCar && localizationData) {
    return (
      <div className="dashboard-container">
        <PersonalDataPage
          selectedCar={selectedCar}
          localizationData={{
            ...localizationData.localization,
            accessories,
            protection: protections,
            personal: personalData,
          }}
          accessories={accessories}
          protections={protections}
          onSuccess={handlePersonalDataSuccess}
          onQuotation={(data, isNewCustomer) => handlePersonalDataQuotation(data, isNewCustomer)}
          onAbort={handlePersonalDataAbort}
        />
      </div>
    );
  }

  if (currentStep === 'quotation' && selectedCar && localizationData && personalData && protocolo) {
    return (
      <div className="dashboard-container">
        <QuotationPage
          selectedCar={selectedCar}
          localizationData={{
            localization: localizationData.localization,
            accessories,
            protection: protections,
            personal: personalData,
          }}
          accessories={accessories}
          protections={protections}
          personalData={personalData}
          protocolo={protocolo}
          agencyCode={agencyCode}
          onSuccess={handleQuotationSuccess}
          onAbort={handleQuotationAbort}
        />
      </div>
    );
  }

  if (currentStep === 'finalization' && selectedCar && booking) {
    return (
      <div className="dashboard-container">
        <FinalizationPage
          selectedCar={selectedCar}
          booking={booking}
          accessories={accessories}
          protections={protections}
          personalData={personalData!}
          onAbort={handleFinalizationAbort}
          onRestart={handleFinalizationRestart}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <div className="dashboard-header">
          <div className="header-top">
            <h1>Sistema de Vendas</h1>
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
          <p>Bem-vindo, {user?.login}!</p>
        </div>

        <div className="dashboard-content">
          {!protocolo ? (
            <div className="content-placeholder">
              <h3>Bem-vindo ao Painel de Vendas</h3>
              <p>Para iniciar um atendimento, clique no botão abaixo.</p>
              <Button
                label="Iniciar Atendimento"
                icon="pi pi-play"
                onClick={handleShowTokenModal}
                className="start-attendance-btn"
              />
            </div>
          ) : currentStep === 'localization' ? (
            <LocalizationForm
              onSuccess={handleLocalizationSuccess}
              onAbort={handleLocalizationAbort}
              agencyCode={agencyCode}
              protocolo={protocolo}
            />
          ) : (
            <div className="content-placeholder">
              <h3>Erro ao carregar dados</h3>
              <p>Os dados de localização não estão disponíveis.</p>
              <Button
                label="Voltar ao formulário"
                icon="pi pi-arrow-left"
                onClick={() => setCurrentStep('localization')}
                severity="secondary"
              />
            </div>
          )}
        </div>
      </Card>

      <StartAttendanceModal
        visible={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSuccess={handleTokenSuccess}
        agencyCode={agencyCode}
      />
    </div>
  );
};

export default Dashboard;
