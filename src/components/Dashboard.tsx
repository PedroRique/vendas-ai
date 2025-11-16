import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LocalizationForm from './LocalizationForm';
import AvailableCarsPage from './AvailableCarsPage';
import AccessoriesPage from './AccessoriesPage';
import ProtectionsPage from './ProtectionsPage';
import PersonalDataPage from './PersonalDataPage';
import QuotationPage from './QuotationPage';
import FinalizationPage from './FinalizationPage';
import ReservasPage from './ReservasPage';
import AdminPage from './AdminPage';
import StepNavigationMenu from './StepNavigationMenu';
import { apiService } from '../services/api';
import type { BookingResponse, QuotationRequest } from '../services/api';
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
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar a página atual baseado na rota
  const getCurrentPageFromPath = (): 'reserve' | 'reservas' | 'admin' => {
    const path = location.pathname;
    if (path.startsWith('/reservas')) return 'reservas';
    if (path.startsWith('/admin')) return 'admin';
    return 'reserve';
  };
  
  const currentPage = getCurrentPageFromPath();
  const [currentStep, setCurrentStep] = useState<'localization' | 'cars' | 'accessories' | 'protections' | 'personal' | 'quotation' | 'finalization'>('localization');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [localizationData, setLocalizationData] = useState<LocalizationFormData | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [protections, setProtections] = useState<Protection[]>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [isInitializingAttendance, setIsInitializingAttendance] = useState(false);

  const agencyCode = (user && 'id_carrental' in user ? (user.id_carrental as number) : 100) || 100;

  // Iniciar atendimento automaticamente quando o componente montar
  useEffect(() => {
    const initializeAttendance = async () => {
      if (!protocolo && !isInitializingAttendance) {
        setIsInitializingAttendance(true);
        try {
          const response = await apiService.startAttendance({
            codigoAgencia: agencyCode,
            // tokenAtendimento é opcional, não enviar se não houver
          });
          const newProtocolo = response.dados.toString();
          setProtocolo(newProtocolo);
        } catch (error) {
          console.error('Erro ao iniciar atendimento:', error);
          // Em caso de erro, ainda permite continuar (pode ser que o backend não exija)
        } finally {
          setIsInitializingAttendance(false);
        }
      }
    };

    if (currentPage === 'reserve') {
      initializeAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyCode, location.pathname]);

  // Função para mapear step para índice
  const getStepIndex = (step: string): number => {
    const stepMap: Record<string, number> = {
      'localization': 0,
      'cars': 1,
      'accessories': 2,
      'protections': 3,
      'personal': 4,
      'quotation': 4, // Mesmo índice que personal
      'finalization': 5,
    };
    return stepMap[step] ?? 0;
  };

  // Atualizar stepIndex quando currentStep mudar
  useEffect(() => {
    const newIndex = getStepIndex(currentStep);
    if (newIndex > currentStepIndex) {
      setCurrentStepIndex(newIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Função para encerrar completamente o atendimento
  const endAttendance = async () => {
    setLocalizationData(null);
    setSelectedCar(null);
    setAccessories([]);
    setProtections([]);
    setPersonalData(null);
    setBooking(null);
    setProtocolo(null); // Limpar protocolo para gerar um novo
    setCurrentStep('localization');
    setCurrentStepIndex(0);
    
    // Iniciar um novo atendimento automaticamente
    try {
      const response = await apiService.startAttendance({
        codigoAgencia: agencyCode,
      });
      const newProtocolo = response.dados.toString();
      setProtocolo(newProtocolo);
    } catch (error) {
      console.error('Erro ao iniciar novo atendimento:', error);
    }
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
    setCurrentStepIndex(1);
  };

  const handleLocalizationAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
  };

  const handleStepChange = (step: string) => {
    // Permitir navegação apenas para steps já visitados e com dados necessários
    const targetIndex = getStepIndex(step);
    if (targetIndex <= currentStepIndex) {
      // Verificar se há dados necessários para navegar para o step
      const stepNeedsData: Record<string, boolean> = {
        'localization': true, // Sempre pode navegar para localization
        'cars': !!localizationData,
        'accessories': !!(selectedCar && localizationData),
        'protections': !!(selectedCar && localizationData),
        'personal': !!(selectedCar && localizationData),
        'quotation': !!(selectedCar && localizationData && personalData),
        'finalization': !!(selectedCar && booking),
      };

      if (stepNeedsData[step] !== false) {
        setCurrentStep(step as typeof currentStep);
      }
    }
  };

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setCurrentStep('accessories');
    setCurrentStepIndex(2);
  };

  const handleCarsPageAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
  };

  const handleAccessoriesSuccess = (selectedAccessories: Accessory[]) => {
    setAccessories(selectedAccessories);
    setCurrentStep('protections');
    setCurrentStepIndex(3);
  };

  const handleAccessoriesAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
  };

  const handleProtectionsSuccess = (selectedProtections: Protection[]) => {
    setProtections(selectedProtections);
    setCurrentStep('personal');
    setCurrentStepIndex(4);
  };

  const handleProtectionsAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
  };

  const handlePersonalDataSuccess = async (data: PersonalData, _isNewCustomer: boolean) => {
    void _isNewCustomer; // Parâmetro não usado, mas necessário para compatibilidade com PersonalDataPage
    setPersonalData(data);
    
    // Salvar dados pessoais e fazer booking
    if (selectedCar && localizationData && protocolo) {
      try {
        // Construir pesquisaLocacao com os dados necessários
        const locData = localizationData.localization as Record<string, unknown>;
        const selectedCarWithLoc = {
          ...selectedCar,
          pesquisaLocacao: {
            ...selectedCar.pesquisaLocacao,
            dataHoraDevolucao: (locData.dataHoraDevolucao as string) || '',
            dataHoraRetirada: (locData.dataHoraRetirada as string) || '',
            localRetiradaSigla: (locData.locaisRetirada as string[])?.[0] || selectedCar.pesquisaLocacao.localRetiradaNome || '',
            localDevolucaoSigla: (locData.locaisDevolucao as string[])?.[0] || selectedCar.pesquisaLocacao.localDevolucaoNome || '',
          },
        };

        const bookingData = formatBooking({
          selectedCar: selectedCarWithLoc,
          personal: {
            ...data,
            documentType: data.documentType || 1, // Default to CPF if not set
          },
          accessories,
          protection: protections,
          localization: localizationData.localization as Record<string, unknown>,
          id_attendance: protocolo,
          id_carrental: agencyCode,
        });

        const response = await apiService.booking(agencyCode, bookingData as QuotationRequest);
        setBooking(response as unknown as BookingResponse);
        setCurrentStep('finalization');
        setCurrentStepIndex(5);
      } catch (error: unknown) {
        console.error('Erro ao finalizar reserva:', error);
        // Não navegar para finalização em caso de erro
      }
    }
  };

  const handlePersonalDataQuotation = async (data: PersonalData, _isNewCustomer: boolean) => {
    void _isNewCustomer; // Parâmetro não usado, mas necessário para compatibilidade com PersonalDataPage
    // Salvar dados pessoais antes de ir para cotação
    setPersonalData(data);
    setCurrentStep('quotation');
    setCurrentStepIndex(4);
  };

  const handlePersonalDataAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
  };

  const handleQuotationSuccess = async () => {
    // Quando clica em "Finalizar" na cotação
    if (selectedCar && localizationData && personalData && protocolo) {
      try {
        // Construir pesquisaLocacao com os dados necessários
        const locData = localizationData.localization as Record<string, unknown>;
        const selectedCarWithLoc = {
          ...selectedCar,
          pesquisaLocacao: {
            ...selectedCar.pesquisaLocacao,
            dataHoraDevolucao: (locData.dataHoraDevolucao as string) || '',
            dataHoraRetirada: (locData.dataHoraRetirada as string) || '',
            localRetiradaSigla: (locData.locaisRetirada as string[])?.[0] || selectedCar.pesquisaLocacao.localRetiradaNome || '',
            localDevolucaoSigla: (locData.locaisDevolucao as string[])?.[0] || selectedCar.pesquisaLocacao.localDevolucaoNome || '',
          },
        };

        const bookingData = formatBooking({
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
        });

        const response = await apiService.booking(agencyCode, bookingData as QuotationRequest);
        setBooking(response as unknown as BookingResponse);
        setCurrentStep('finalization');
        setCurrentStepIndex(5);
      } catch (error: unknown) {
        console.error('Erro ao finalizar reserva:', error);
      }
    }
  };

  const handleQuotationAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
  };

  const handleFinalizationAbort = () => {
    // Encerrar atendimento completamente
    endAttendance();
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

  // Render Admin page
  if (currentPage === 'admin') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reserve Aqui"
              icon="pi pi-shopping-cart"
              onClick={() => navigate('/reserve')}
              severity="secondary"
              outlined
              size="small"
            />
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        <AdminPage />
      </div>
    );
  }

  // Render Reservas page
  if (currentPage === 'reservas') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reserve Aqui"
              icon="pi pi-shopping-cart"
              onClick={() => navigate('/reserve')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        <ReservasPage />
      </div>
    );
  }

  if (currentStep === 'cars' && localizationData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        {protocolo && (
          <StepNavigationMenu
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onStepChange={handleStepChange}
          />
        )}
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
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        {protocolo && (
          <StepNavigationMenu
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onStepChange={handleStepChange}
          />
        )}
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
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        {protocolo && (
          <StepNavigationMenu
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onStepChange={handleStepChange}
          />
        )}
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
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        {protocolo && (
          <StepNavigationMenu
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onStepChange={handleStepChange}
          />
        )}
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
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        {protocolo && (
          <StepNavigationMenu
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onStepChange={handleStepChange}
          />
        )}
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
        <div className="dashboard-header-bar">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        {protocolo && (
          <StepNavigationMenu
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onStepChange={handleStepChange}
          />
        )}
        <FinalizationPage
          selectedCar={selectedCar}
          booking={booking as unknown as { codigoReservaAgencia?: string; codigoReserva?: string; [key: string]: unknown }}
          accessories={accessories}
          protections={protections}
          personalData={personalData!}
          onAbort={handleFinalizationAbort}
          onRestart={handleFinalizationRestart}
        />
      </div>
    );
  }

  const renderDashboardContent = () => {
    if (isInitializingAttendance) {
      return (
        <div className="content-placeholder">
          <h3>Iniciando atendimento...</h3>
          <p>Aguarde enquanto o sistema prepara o atendimento.</p>
        </div>
      );
    }

    if (currentStep === 'localization') {
      return (
        <>
          {protocolo && (
            <StepNavigationMenu
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              onStepChange={handleStepChange}
            />
          )}
          <LocalizationForm
            onSuccess={(data) => handleLocalizationSuccess(data as unknown as LocalizationFormData)}
            onAbort={handleLocalizationAbort}
            agencyCode={agencyCode}
            protocolo={protocolo}
          />
        </>
      );
    }

    return (
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
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-top">
          <h1>Reserve Aqui</h1>
          <div className="header-actions">
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
        </div>
        <p>Bem-vindo, {user?.name} {user?.surname}!</p>
      </div>

      <div className="dashboard-content">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;
