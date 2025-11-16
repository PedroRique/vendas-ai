import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import dayjs from 'dayjs';
import { useLocalization } from '../hooks/useLocalization';
import { localizationService, type LocationPlace } from '../services/localization';
import { useAuth } from '../hooks/useAuth';
import AutocompleteInput, { type AutocompleteCategory } from './AutocompleteInput';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import './LocalizationForm.scss';

interface LocalizationFormProps {
  onSuccess?: (data: Record<string, unknown>) => void;
  onAbort?: () => void;
  agencyCode?: number;
  protocolo?: string | null;
}

const LocalizationForm: React.FC<LocalizationFormProps> = ({
  onSuccess,
  onAbort,
  agencyCode = 0,
  protocolo = null,
}) => {
  const { user } = useAuth();
  const toast = React.useRef<Toast>(null);
  
  const {
    // Locadoras
    locadoras,
    selectedLocadoras,
    setSelectedLocadoras,
    isLoadingLocadoras,
    
    // Franchise KM
    franchiseKmList,
    selectedFranchiseKm,
    setSelectedFranchiseKm,
    
    // Locations
    getCarPlace,
    retrievePlace,
    getCarWhere,
    retrieveWhere,
    setGetCarWhere,
    setRetrieveWhere,
    locations,
    selectGetCarPlace,
    selectRetrievePlace,
    searchLocations,
    
    // Dates
    getCarDate,
    getCarHour,
    retrieveDate,
    retrieveHour,
    minGetCarDate,
    minRetrieveDate,
    setGetCarDate,
    setGetCarHour,
    setRetrieveDate,
    setRetrieveHour,
    
    // Other
    coupon,
    setCoupon,
    showRetrieve,
    setShowRetrieve,
    
    // Status
    isLoading,
    isLoadingLocations,
    locationError,
  } = useLocalization(agencyCode || (user && 'id_carrental' in user ? (user.id_carrental as number) : 100) || 100);

  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepare locadoras options for MultiSelect
  // Usar nomeAgencia como valor para garantir consistência com os filtros de carros
  const locadorasOptions = useMemo(() => {
    return locadoras.map(loc => {
      const nomeAgencia = loc.nomeAgencia || loc.nome || `Locadora ${loc.codigo}`;
      return {
        label: nomeAgencia,
        value: nomeAgencia, // Usar o nome exato que aparece nos carros
      };
    });
  }, [locadoras]);

  // Location categories for autocomplete
  const getCarLocationCategories: AutocompleteCategory[] = useMemo(() => {
    const cats: AutocompleteCategory[] = [];
    if (locations.airports.length > 0) {
      cats.push({
        title: 'Aeroportos',
        items: locations.airports,
        icon: 'airport',
      });
    }
    if (locations.cities.length > 0) {
      cats.push({
        title: 'Cidades',
        items: locations.cities,
        icon: 'city',
      });
    }
    if (locations.districts.length > 0) {
      cats.push({
        title: 'Bairros',
        items: locations.districts,
        icon: 'district',
      });
    }
    if (locations.stores.length > 0) {
      cats.push({
        title: 'Lojas',
        items: locations.stores,
        icon: 'store',
      });
    }
    return cats;
  }, [locations]);


  // Handle location search with debounce
  const handleLocationSearch = (value: string, forRetrieve: boolean = false) => {
    if (forRetrieve) {
      setRetrieveWhere(value);
    } else {
      setGetCarWhere(value);
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      searchLocations(value, forRetrieve);
    }, 1000);

    setSearchTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Show toast when location error occurs
  useEffect(() => {
    if (locationError) {
      // Verificar se há erros individuais da API
      const apiErrors = (locationError as Error & { apiErrors?: unknown[] })?.apiErrors;
      
      if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
        // Mostrar um toast para cada erro
        apiErrors.forEach((error: { message?: string; code?: string }) => {
          const errorMessage = error.message || `Erro ${error.code || 'desconhecido'}`;
          toast.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
            life: 5000,
          });
        });
      } else {
        // Se não houver erros individuais, mostrar o erro geral
        const errorMessage = locationError.message || 'Erro ao buscar locais. Tente novamente.';
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage,
          life: 5000,
        });
      }
    }
  }, [locationError]);

  // Check if can show franchise
  const canShowFranchise = (): boolean => {
    // Check date range for Mensal Flex (assuming 30 days threshold)
    const dateDiff = dayjs(retrieveDate).diff(dayjs(getCarDate), 'days');
    return dateDiff >= 30;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    if (!getCarPlace) return false;
    if (showRetrieve && !retrievePlace) return false;
    if (canShowFranchise() && !selectedFranchiseKm) return false;
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    setIsSubmitting(true);
    setCouponError('');

    try {
      const finalRetrievePlace = showRetrieve ? retrievePlace : getCarPlace;
      
      if (!finalRetrievePlace || !getCarPlace) {
        throw new Error('Locais não selecionados');
      }

      // Prepare tarifas
      const tarifas = [];
      if (canShowFranchise() && selectedFranchiseKm) {
        tarifas.push(selectedFranchiseKm);
      }

      // Format dates
      const dataHoraRetirada = dayjs(getCarDate)
        .format('YYYY-MM-DD') + 'T' + dayjs(getCarHour).format('HH:mm:ss');
      const dataHoraDevolucao = dayjs(retrieveDate)
        .format('YYYY-MM-DD') + 'T' + dayjs(retrieveHour).format('HH:mm:ss');

      // Obter protocolo (obrigatório para a API)
      const protocoloToUse = protocolo || (user && 'protocolo' in user ? (user.protocolo as string) : null);
      
      if (!protocoloToUse) {
        toast.current?.show({ 
          severity: 'error',
          summary: 'Erro',
          detail: 'Protocolo não encontrado. Por favor, recarregue a página.',
        });
        return;
      }

      // Prepare request data
      const requestData = {
        codCupom: coupon || undefined,
        dataHoraDevolucao,
        dataHoraRetirada,
        devolverNoMesmoLocalRetirada: !showRetrieve,
        locaisDevolucao: finalRetrievePlace.lojas || [finalRetrievePlace.sigla || ''],
        locaisRetirada: getCarPlace.lojas || [getCarPlace.sigla || ''],
        protocolo: protocoloToUse,
        franquiaKM: selectedFranchiseKm || undefined,
        tarifas,
        locadoras: selectedLocadoras.length > 0 ? selectedLocadoras : undefined,
      };

      const agencyCodeToUse = agencyCode || (user && 'id_carrental' in user ? (user.id_carrental as number) : 100) || 100;
      
      const response = await localizationService.verifyAvailableCars(
        agencyCodeToUse,
        requestData
      );

      // Check coupon validity - só validar se cupom foi enviado e está inválido
      if (coupon && response.filtroCupom && !response.filtroCupom.valido) {
        setCouponError('Cupom inválido');
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Cupom inválido',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Limpar erro de cupom se cupom foi removido ou é válido
      if (!coupon || (response.filtroCupom && response.filtroCupom.valido)) {
        setCouponError('');
      }

      // Check if cars are available
      if (!response.veiculosDisponiveis || response.veiculosDisponiveis.length === 0) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Não existe veículo disponível para essa localidade.',
        });
        setIsSubmitting(false);
        return;
      }

      // Success
      const dateDiff = dayjs(retrieveDate).diff(dayjs(getCarDate), 'days');
      const rentalType = localizationService.getRentalType(
        null, // No partner anymore
        dateDiff,
        30 // rangeDayMonthly - could be from config
      );

      const formData = {
        localization: requestData,
        availability: response,
        rentalType,
        getCarPlace,
        retrievePlace: finalRetrievePlace,
      };

      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Locais salvos com sucesso.',
      });

      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível processar a solicitação. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbort = () => {
    if (onAbort) {
      onAbort();
    }
  };

  return (
    <div className="localization-form-container">
      <Toast ref={toast} />
      <section className="localization">
        <h1 className="main-title">Destino / Locação</h1>
        <form className="localization-form" onSubmit={handleSubmit}>
          {/* Locadoras Selection */}
          <div className="box">
            <label htmlFor="locadoras" className="form-label -locadoras">
              Locadoras
            </label>
            <MultiSelect
              id="locadoras"
              value={selectedLocadoras}
              options={locadorasOptions}
              onChange={(e) => setSelectedLocadoras(e.value || [])}
              placeholder="Selecione as locadoras (opcional)"
              display="chip"
              className="locadoras-multiselect"
              loading={isLoadingLocadoras}
              filter
              showClear
            />
            <small className="form-help-text">
              Se nenhuma locadora for selecionada, o sistema pesquisará em todas as locadoras disponíveis.
            </small>
          </div>

          {/* Get Car Location */}
          <div className="box">
            <label htmlFor="txtGetCarWhere" className="form-label">
              Retirar o carro em
            </label>
            <AutocompleteInput
              value={getCarWhere}
              onChange={(value) => handleLocationSearch(value, false)}
              onSelect={(item) => selectGetCarPlace(item as LocationPlace)}
              categories={getCarLocationCategories}
              placeholder="Digite a cidade ou o aeroporto"
              className="location-autocomplete"
              required
              loading={isLoadingLocations}
            />
          </div>

          {/* Return in different location checkbox */}
          <div>
            <input
              type="checkbox"
              id="chkRetrieve"
              className="form-control-chk"
              checked={showRetrieve}
              onChange={(e) => setShowRetrieve(e.target.checked)}
            />
            <label htmlFor="chkRetrieve" className="form-label-chk">
              Devolver em outra cidade
            </label>
          </div>

          {/* Retrieve Location */}
          {showRetrieve && (
            <div className="box">
              <label htmlFor="txtRetrieveWhere" className="form-label">
                Devolver o carro em
              </label>
              <AutocompleteInput
                value={retrieveWhere}
                onChange={(value) => handleLocationSearch(value, true)}
                onSelect={(item) => selectRetrievePlace(item as LocationPlace)}
                categories={getCarLocationCategories}
                placeholder="Digite a cidade ou o aeroporto"
                className="location-autocomplete"
                required
                loading={isLoadingLocations}
              />
            </div>
          )}

          {/* Get Car Date and Time */}
          <div className="box">
            <label htmlFor="dtGetCarDate" className="form-label form-label-dt">
              Data de Retirada
            </label>
            <DatePicker
              selectedDate={getCarDate}
              minDate={minGetCarDate}
              onDateChange={setGetCarDate}
              placeholder="Selecione a data"
            />
            <label htmlFor="tmGetCarHour" className="form-label-hr">
              Horário
            </label>
            <TimePicker
              selectedTime={getCarHour}
              onTimeChange={setGetCarHour}
              placeholder="00:00"
            />
          </div>

          {/* Retrieve Date and Time */}
          <div className="box">
            <label htmlFor="dtRetrieveDate" className="form-label form-label-dt -retrieve">
              Data de Entrega
            </label>
            <DatePicker
              selectedDate={retrieveDate}
              minDate={minRetrieveDate}
              onDateChange={setRetrieveDate}
              placeholder="Selecione a data"
            />
            <label htmlFor="tmRetrieveHour" className="form-label-hr">
              Horário
            </label>
            <TimePicker
              selectedTime={retrieveHour}
              onTimeChange={setRetrieveHour}
              placeholder="00:00"
            />
          </div>

          {/* Franchise KM */}
          {canShowFranchise() && (
            <div className="box">
              <label htmlFor="franchiseKm" className="form-label -franchiseKm">
                Franquia KM
              </label>
              <Dropdown
                id="franchiseKm"
                value={selectedFranchiseKm}
                options={franchiseKmList}
                onChange={(e) => setSelectedFranchiseKm(e.value)}
                optionLabel="descricao"
                placeholder="Selecione a franquia"
                className="form-control-franchiseKm"
                required
              />
            </div>
          )}

          {/* Coupon */}
          <div className="box">
            <label htmlFor="coupon" className="form-label -coupon">
              Cupom
            </label>
            <InputText
              id="coupon"
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value);
                setCouponError('');
              }}
              placeholder="Digite o código do cupom"
              className={`form-control-coupon ${couponError ? '-error' : ''}`}
            />
            {couponError && (
              <div className="input-error">
                <span>{couponError}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="footer">
            <Button
              type="button"
              label="Encerrar"
              icon="pi pi-times"
              onClick={handleAbort}
              className="btn -abort"
              severity="secondary"
            />
            <Button
              type="submit"
              label="Continuar"
              icon="pi pi-check"
              className="btn -continue"
              disabled={!isFormValid() || isSubmitting || isLoading || isLoadingLocations}
              loading={isSubmitting}
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default LocalizationForm;

