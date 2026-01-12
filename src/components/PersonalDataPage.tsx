import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { apiService, DocumentTypesEnum } from '../services/api';
import { validateCPF } from '../utils/cpfValidator';
import { cleanCPF } from '../utils/cpfMask';
import { formatPhoneBR, cleanPhone } from '../utils/phoneMask';
import { SORTED_DDI_LIST } from '../utils/ddiList';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import type { Protection } from './ProtectionsPage';
import Sidebar from './Sidebar';
import './PersonalDataPage.scss';

export interface PersonalData {
  cpf?: string;
  passport?: string;
  name: string;
  tel: string;
  email: string;
  customerId?: number;
  documentType?: number;
  foreigner?: boolean;
}

interface PersonalDataPageProps {
  selectedCar: Car;
  localizationData: Record<string, unknown>;
  accessories: Accessory[];
  protections: Protection[];
  onSuccess: (personalData: PersonalData, isNewCustomer: boolean) => void;
  onQuotation?: (personalData: PersonalData, isNewCustomer: boolean) => void;
  onAbort?: () => void;
}

const PersonalDataPage: React.FC<PersonalDataPageProps> = ({
  selectedCar,
  localizationData,
  accessories,
  protections,
  onSuccess,
  onQuotation,
  onAbort,
}) => {
  const toast = React.useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  
  const [foreigner, setForeigner] = useState(false);
  const [personal, setPersonal] = useState<PersonalData>(() => {
    const saved = (localizationData.personal as PersonalData) || {};
    return {
      name: saved.name || '',
      tel: saved.tel || '',
      email: saved.email || '',
      cpf: saved.cpf || '',
      passport: saved.passport || '',
      customerId: saved.customerId,
      documentType: saved.documentType,
      foreigner: saved.foreigner || false,
    };
  });

  const [ddiSelected, setDdiSelected] = useState<string>('0055');
  const [phoneMask, setPhoneMask] = useState<string>('(99) 99999-9999');
  const [cpfValue, setCpfValue] = useState<string>(personal.cpf || '');
  const [passportValue, setPassportValue] = useState<string>(personal.passport || '');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customerStatus, setCustomerStatus] = useState<'NOT_FOUND' | 'REGISTRED'>(
    personal.customerId ? 'REGISTRED' : 'NOT_FOUND'
  );

  // Formatar telefone ao mudar DDI
  useEffect(() => {
    if (ddiSelected === '0055') {
      setPhoneMask('(99) 99999-9999');
    } else {
      setPhoneMask('');
    }
  }, [ddiSelected]);

  // Preparar lista de DDI para dropdown
  const ddiOptions = useMemo(() => {
    return SORTED_DDI_LIST.map((ddi) => ({
      label: `+${ddi.fone} (${ddi.nome})`,
      value: ddi.fone,
    }));
  }, []);

  // Validar CPF ao perder foco
  const handleCPFBlur = () => {
    if (cpfValue && !foreigner) {
      if (!validateCPF(cpfValue)) {
        setErrors({ ...errors, cpf: 'Por favor, insira um CPF válido.' });
      } else {
        setErrors({ ...errors, cpf: '' });
      }
    }
  };

  // Validar telefone
  const validatePhone = (phone: string): boolean => {
    const cleaned = cleanPhone(phone);
    if (cleaned.length < 10) {
      return false;
    }
    
    // Verifica se são todos iguais
    const invalidPatterns = [
      '000000000',
      '111111111',
      '222222222',
      '333333333',
      '444444444',
      '555555555',
      '666666666',
      '777777777',
      '888888888',
    ];
    
    return !invalidPatterns.includes(cleaned.slice(0, 9));
  };

  // Buscar cliente por documento
  const handleFindCustomer = async () => {
    if (foreigner && !passportValue) {
      setErrors({ ...errors, passport: 'Please, insert you passport.' });
      return;
    }

    if (!foreigner && !cpfValue) {
      setErrors({ ...errors, cpf: 'Por favor, insira um CPF válido.' });
      return;
    }

    if (!foreigner && !validateCPF(cpfValue)) {
      setErrors({ ...errors, cpf: 'Por favor, insira um CPF válido.' });
      return;
    }

    setIsSearchingCustomer(true);
    setErrors({});

    try {
      const documentNumber = foreigner ? passportValue : cleanCPF(cpfValue);
      const response = await apiService.findCustomer(documentNumber);

      // Preencher dados do cliente encontrado
      const customerData = response.dados;
      
      // Extrair DDI do telefone se começar com código de país
      let phoneWithoutDDI = customerData.telefone || '';
      let phoneDDI = '0055';
      
      if (phoneWithoutDDI) {
        if (phoneWithoutDDI.startsWith('55')) {
          phoneDDI = '0055';
          phoneWithoutDDI = phoneWithoutDDI.substring(2);
        } else {
          // Tentar encontrar DDI
          const foundDDI = SORTED_DDI_LIST.find((ddi) => phoneWithoutDDI.startsWith(ddi.fone));
          if (foundDDI) {
            phoneDDI = foundDDI.fone;
            phoneWithoutDDI = phoneWithoutDDI.substring(foundDDI.fone.length);
          }
        }
        
        // Formatar telefone se for Brasil
        const formattedPhone = phoneDDI === '0055' ? formatPhoneBR(phoneWithoutDDI) : phoneWithoutDDI;
        
        setPersonal({
          ...personal,
          name: customerData.nomeCompleto || '',
          email: customerData.email || '',
          tel: formattedPhone,
          customerId: customerData.clienteId,
          documentType: customerData.tipoDocumentoId,
          cpf: !foreigner ? cleanCPF(cpfValue) : '',
          passport: foreigner ? passportValue : '',
        });
        
        setDdiSelected(phoneDDI);
      } else {
        setPersonal({
          ...personal,
          name: customerData.nomeCompleto || '',
          email: customerData.email || '',
          tel: '',
          customerId: customerData.clienteId,
          documentType: customerData.tipoDocumentoId,
          cpf: !foreigner ? cleanCPF(cpfValue) : '',
          passport: foreigner ? passportValue : '',
        });
      }

      setCustomerStatus('REGISTRED');
      
      toast.current?.show({
        severity: 'success',
        summary: 'Cliente encontrado',
        detail: 'Dados do cliente carregados com sucesso.',
      });
    } catch (error: unknown) {
      // Cliente não encontrado - limpar campos
      console.error('Erro ao buscar cliente:', error);
      setPersonal({
        ...personal,
        name: '',
        tel: '',
        email: '',
        customerId: undefined,
      });
      setCustomerStatus('NOT_FOUND');
      
      toast.current?.show({
        severity: 'warn',
        summary: 'Cliente não encontrado',
        detail: 'Cliente não cadastrado. Preencha os dados para cadastrar.',
      });
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  // Toggle estrangeiro
  const handleToggleForeigner = () => {
    const newForeigner = !foreigner;
    setForeigner(newForeigner);
    setPersonal({
      ...personal,
      foreigner: newForeigner,
      cpf: newForeigner ? '' : personal.cpf,
      passport: !newForeigner ? '' : personal.passport,
    });
    setCpfValue(newForeigner ? '' : cpfValue);
    setPassportValue(!newForeigner ? '' : passportValue);
    setErrors({});
  };

  // Validar formulário
  const isFormValid = (): boolean => {
    if (foreigner) {
      return !!(passportValue && personal.name && personal.tel && personal.email);
    } else {
      return !!(
        cpfValue &&
        validateCPF(cpfValue) &&
        personal.name &&
        personal.tel &&
        personal.email
      );
    }
  };

  // Salvar cliente (cadastrar ou editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar telefone
    const cleanedPhone = cleanPhone(personal.tel);
    if (!validatePhone(cleanedPhone)) {
      setErrors({ ...errors, tel: 'Número inválido.' });
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Número de telefone inválido.',
      });
      return;
    }

    if (!isFormValid()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const documentNumber = foreigner ? passportValue : cleanCPF(cpfValue);
      const documentType = foreigner ? DocumentTypesEnum.PASSAPORT : DocumentTypesEnum.CPF;
      const fullPhone = ddiSelected + cleanPhone(personal.tel);

      const customerData = {
        nomeCompleto: personal.name,
        email: personal.email,
        telefone: fullPhone,
        documento: documentNumber,
        tipoDocumentoId: documentType,
      };

      let isNewCustomer = false;

      if (customerStatus === 'NOT_FOUND') {
        // Cadastrar novo cliente
        const response = await apiService.saveCustomer(customerData);
        setPersonal({ ...personal, customerId: response.dados.clienteId });
        isNewCustomer = true;
      } else if (personal.customerId) {
        // Editar cliente existente
        await apiService.editCustomer(personal.customerId, customerData);
      }

      const finalPersonalData: PersonalData = {
        ...personal,
        name: personal.name,
        email: personal.email,
        tel: fullPhone,
        cpf: !foreigner ? cleanCPF(cpfValue) : undefined,
        passport: foreigner ? passportValue : undefined,
        documentType,
      };

      onSuccess(finalPersonalData, isNewCustomer);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados pessoais salvos com sucesso.',
      });
    } catch (error: unknown) {
      console.error('Erro ao salvar dados pessoais:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar os dados pessoais.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar cotação (salvar os dados primeiro)
  const handleQuotation = async () => {
    if (!isFormValid()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Necessário preencher os campos antes para gerar cotação.',
      });
      return;
    }

    // Validar telefone
    const cleanedPhone = cleanPhone(personal.tel);
    if (!validatePhone(cleanedPhone)) {
      setErrors({ ...errors, tel: 'Número inválido.' });
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Número de telefone inválido.',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const documentNumber = foreigner ? passportValue : cleanCPF(cpfValue);
      const documentType = foreigner ? DocumentTypesEnum.PASSAPORT : DocumentTypesEnum.CPF;
      const fullPhone = ddiSelected + cleanPhone(personal.tel);

      const customerData = {
        nomeCompleto: personal.name,
        email: personal.email,
        telefone: fullPhone,
        documento: documentNumber,
        tipoDocumentoId: documentType,
      };

      let isNewCustomer = false;

      if (customerStatus === 'NOT_FOUND') {
        // Cadastrar novo cliente
        const response = await apiService.saveCustomer(customerData);
        setPersonal({ ...personal, customerId: response.dados.clienteId });
        isNewCustomer = true;
      } else if (personal.customerId) {
        // Editar cliente existente
        await apiService.editCustomer(personal.customerId, customerData);
      }

      const finalPersonalData: PersonalData = {
        ...personal,
        name: personal.name,
        email: personal.email,
        tel: fullPhone,
        cpf: !foreigner ? cleanCPF(cpfValue) : undefined,
        passport: foreigner ? passportValue : undefined,
        documentType,
      };

      if (onQuotation) {
        onQuotation(finalPersonalData, isNewCustomer);
      }
      
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados pessoais salvos com sucesso.',
      });
    } catch (error: unknown) {
      console.error('Erro ao salvar dados pessoais:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar os dados pessoais.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbort = () => {
    if (onAbort) {
      onAbort();
    }
  };

  return (
    <div className="personal-data-page sidebar-container">
      <Toast ref={toast} />
      <Card className="personal-data-card">
        <div className="personal-data-header">
          <h1 className="main-title">Dados Pessoais</h1>
        </div>

        <form className="personal-data-form" onSubmit={handleSubmit}>
          {/* CPF ou Passaporte */}
          {!foreigner ? (
            <div className="form-field">
              <label htmlFor="txtCpf" className="form-label">
                CPF
              </label>
              <InputMask
                id="txtCpf"
                mask="999.999.999-99"
                value={cpfValue}
                onChange={(e) => {
                  const value = e.value || '';
                  setCpfValue(value);
                  setPersonal({ ...personal, cpf: cleanCPF(value) });
                  setErrors({ ...errors, cpf: '' });
                }}
                onBlur={handleCPFBlur}
                placeholder="XXX.XXX.XXX-XX"
                className={errors.cpf ? 'p-invalid' : ''}
                disabled={isLoading || isSearchingCustomer}
              />
              {errors.cpf && (
                <div className="input-error">
                  <span>{errors.cpf}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="form-field">
              <label htmlFor="txtPassport" className="form-label">
                Passaporte
              </label>
              <InputText
                id="txtPassport"
                value={passportValue}
                onChange={(e) => {
                  setPassportValue(e.target.value);
                  setPersonal({ ...personal, passport: e.target.value });
                  setErrors({ ...errors, passport: '' });
                }}
                placeholder="Número do passaporte"
                className={errors.passport ? 'p-invalid' : ''}
                disabled={isLoading || isSearchingCustomer}
              />
              {errors.passport && (
                <div className="input-error">
                  <span>{errors.passport}</span>
                </div>
              )}
            </div>
          )}

          {/* Checkbox Estrangeiro */}
          <div className="form-field checkbox-field">
            <Checkbox
              inputId="isForeigner"
              checked={foreigner}
              onChange={handleToggleForeigner}
              disabled={isLoading || isSearchingCustomer}
            />
            <label htmlFor="isForeigner" className="form-label-checkbox">
              Sou estrangeiro?
            </label>
          </div>

          {/* Nome */}
          <div className="form-field">
            <label htmlFor="txtName" className="form-label">
              Nome
            </label>
            <InputText
              id="txtName"
              value={personal.name}
              onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
              placeholder="Nome do cliente"
              maxLength={80}
              disabled={isLoading || isSearchingCustomer}
              required
            />
          </div>

          {/* Telefone */}
          <div className="form-field">
            <label htmlFor="txtTel" className="form-label">
              Telefone (celular)
            </label>
            <div className="phone-input-group">
              <Dropdown
                id="dddi"
                value={ddiSelected}
                options={ddiOptions}
                onChange={(e) => {
                  setDdiSelected(e.value);
                  if (e.value === '0055') {
                    setPersonal({ ...personal, tel: formatPhoneBR(personal.tel) });
                  }
                }}
                disabled={isLoading || isSearchingCustomer}
                className="ddi-select"
              />
              <InputMask
                id="txtTel"
                mask={phoneMask}
                value={personal.tel}
                onChange={(e) => {
                  const value = e.value || '';
                  setPersonal({ ...personal, tel: value });
                  setErrors({ ...errors, tel: '' });
                }}
                placeholder={ddiSelected === '0055' ? '(XX) XXXXX-XXXX' : 'Número do telefone'}
                className={`phone-input ${errors.tel ? 'p-invalid' : ''}`}
                disabled={isLoading || isSearchingCustomer}
                required
              />
            </div>
            {errors.tel && (
              <div className="input-error">
                <span>{errors.tel}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor="txtEmail" className="form-label">
              E-mail
            </label>
            <InputText
              id="txtEmail"
              type="email"
              value={personal.email}
              onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
              placeholder="cliente.email@provedor.com.br"
              disabled={isLoading || isSearchingCustomer}
              required
            />
          </div>

          {/* Botão Buscar Cliente (apenas se não for estrangeiro e tiver CPF) */}
          {!foreigner && cpfValue && !customerStatus && (
            <div className="form-field">
              <Button
                type="button"
                label="Buscar Cliente"
                icon="pi pi-search"
                onClick={handleFindCustomer}
                loading={isSearchingCustomer}
                disabled={!validateCPF(cpfValue) || isSearchingCustomer}
                severity="secondary"
                outlined
              />
            </div>
          )}

          {/* Footer */}
          <div className="personal-data-footer">
            <Button
              type="button"
              label="Encerrar"
              icon="pi pi-times"
              severity="secondary"
              onClick={handleAbort}
              disabled={isLoading || isSearchingCustomer}
            />
            <Button
              type="button"
              label="Gerar cotação"
              icon="pi pi-file"
              severity="info"
              onClick={handleQuotation}
              disabled={!isFormValid() || isLoading || isSearchingCustomer}
              outlined
            />
            <Button
              type="submit"
              label="Finalizar"
              icon="pi pi-check"
              loading={isLoading}
              disabled={!isFormValid() || isLoading || isSearchingCustomer}
            />
          </div>
        </form>
      </Card>

      <Sidebar
        selectedCar={selectedCar}
        localizationData={localizationData}
        accessories={accessories}
        protections={protections}
        personalData={personal}
      />
    </div>
  );
};

export default PersonalDataPage;

