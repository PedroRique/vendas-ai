import React, { useMemo } from 'react';
import { Toast } from 'primereact/toast';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import type { Protection } from './ProtectionsPage';
import type { PersonalData } from './PersonalDataPage';
import { buildSidebarCopyText, copyTextToClipboard } from '../utils/sidebarCopy';
import { getAccessoryLineTotal } from '../utils/accessoryPricing';
import './Sidebar.scss';

interface LocalizationData {
  dataHoraRetirada?: string;
  dataHoraDevolucao?: string;
  codCupom?: string;
  pickupPlaceName?: string;
  returnPlaceName?: string;
  franquiaKM?: {
    codigo?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface SidebarProps {
  selectedCar: Car;
  localizationData?: LocalizationData;
  accessories?: Accessory[];
  protections?: Protection[];
  personalData?: PersonalData;
  quotation?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCar,
  localizationData,
  accessories = [],
  protections = [],
  personalData,
  quotation = false,
}) => {
  const toast = React.useRef<Toast>(null);

  const car = selectedCar.vehicleData;
  const rentalSearch = selectedCar.rentalSearch;
  const dailys = car.numberOfDays || 0;

  const pickupLocationLabel =
    localizationData?.pickupPlaceName?.trim() ||
    rentalSearch?.pickupStoreName ||
    rentalSearch?.pickupStoreCode ||
    '';
  const returnLocationLabel =
    localizationData?.returnPlaceName?.trim() ||
    rentalSearch?.returnStoreName ||
    rentalSearch?.returnStoreCode ||
    '';

  // Formatar data e hora
  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return '--';
    try {
      const date = new Date(dateTime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateTime;
    }
  };

  // Formatar valor em reais
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const valorDiariaPorUnidade = car.dailyValue ?? 0;
  const valorBaseVeiculo = car.totalMonthlyDailyRateValue || car.totalValue || 0;
  const valorTotalDiariasCalculado =
    dailys > 0 ? dailys * valorDiariaPorUnidade : valorBaseVeiculo;

  const taxaAdministrativaValor = useMemo(() => {
    const pct = car.administrativeFeePercentage || 0;
    if (pct <= 0) return 0;
    const somaAcessorios = accessories.reduce(
      (s, a) => s + getAccessoryLineTotal(selectedCar.optionalAddonsData, dailys, a),
      0
    );
    const somaProtecoes = protections.reduce((s, p) => s + (p.valorTotal || 0), 0);
    const base = valorTotalDiariasCalculado + somaAcessorios + somaProtecoes;

    return (base * pct) / 100;
  }, [
    car.administrativeFeePercentage,
    valorTotalDiariasCalculado,
    accessories,
    protections,
    selectedCar.optionalAddonsData,
    dailys,
  ]);

  const valorHoraExtraTotal = car.totalOvertimeValue ?? 0;
  const valorHoraExtraPorUnidade = car.overtimeValue ?? 0;
  const valorTaxaDevolucao = car.returnFeeValue ?? 0;

  const totalRodape = useMemo(() => {
    const somaAcessorios = accessories.reduce(
      (s, a) => s + getAccessoryLineTotal(selectedCar.optionalAddonsData, dailys, a),
      0
    );
    const somaProtecoes = protections.reduce((s, p) => s + (p.valorTotal || 0), 0);
    return (
      valorTotalDiariasCalculado + somaAcessorios + somaProtecoes + taxaAdministrativaValor + valorTaxaDevolucao
    );
  }, [
    valorTotalDiariasCalculado,
    accessories,
    protections,
    selectedCar.optionalAddonsData,
    dailys,
    taxaAdministrativaValor,
    valorTaxaDevolucao,
  ]);

  const quantidadeHoraExtra = car.numberOfOvertimeHours || 0;
  const percentualTaxaEventual = car.administrativeFeePercentage || 0;

  const handleCopyData = () => {
    const texto = buildSidebarCopyText({
      personalData,
      localizationData,
      pickupLocationLabel,
      returnLocationLabel,
      car,
      optionalAddonsData: selectedCar.optionalAddonsData,
      dailys,
      valorDiariaPorUnidade,
      valorTotalDiariasCalculado,
      accessories,
      protections,
      quantidadeHoraExtra,
      valorHoraExtraPorUnidade,
      valorHoraExtraTotal,
      valorTaxaDevolucao,
      percentualTaxaEventual,
      taxaAdministrativaValor,
      totalRodape,
    });
    void copyTextToClipboard(texto).then(() => {
      toast.current?.show({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Copiado para área de transferência.',
      });
    });
  };

  return (
    <aside className={`sidebar ${quotation ? '-quotation' : ''}`}>
      <Toast ref={toast} />
      <div className="sidebar-content">
        <button 
          className="btn-copy" 
          onClick={handleCopyData}
          title="Copiar informações"
          aria-label="Copiar informações"
        />

        <div className="info-car-box">
          <div className="car-info">
            <div className="media-box">
              {car.imageUrl && (
                <img 
                  src={car.imageUrl} 
                  alt={car.model || 'Carro'} 
                />
              )}
            </div>
          </div>
        </div>

        {personalData && (
          <p className="label">
            <br />
            Nome: <span className="value">{personalData.name || personalData.name}</span>
          </p>
        )}

        <p className="label">
          Descrição: <br />
          <span className="value">{car.vehicleGroup || '--'}</span>
        </p>

        <p className="label">
          Modelo: <br />
          <span className="value">{car.model || '--'}</span>
        </p>

        {localizationData?.franquiaKM?.codigo && (
          <p className="label">
            Franquia: <br />
            <span className="value">{localizationData.franquiaKM.codigo} Km/mês</span>
          </p>
        )}

        {localizationData?.dataHoraRetirada && (
          <p className="label">
            Data de Retirada: <br />
            <span className="value">{formatDateTime(localizationData.dataHoraRetirada)}</span>
          </p>
        )}

        {pickupLocationLabel && (
          <p className="label">
            Local Retirada: <br />
            <span className="value">{pickupLocationLabel}</span>
          </p>
        )}

        {localizationData?.dataHoraDevolucao && (
          <p className="label">
            Data Devolução: <br />
            <span className="value">{formatDateTime(localizationData.dataHoraDevolucao)}</span>
          </p>
        )}

        {returnLocationLabel && (
          <p className="label">
            Local Devolução: <br />
            <span className="value">{returnLocationLabel}</span>
          </p>
        )}

        {localizationData?.codCupom && (
          <p className="label">
            Cupom de Desconto: <br />
            <span className="value">{localizationData.codCupom}</span>
          </p>
        )}

        <p className="label">
          Diárias: <br />
          <span className="value">{dailys}x {formatCurrency(valorDiariaPorUnidade)}</span>
          <span className="price">{formatCurrency(valorTotalDiariasCalculado)}</span>
        </p>

        <div className="list-box">
          <p className="list-label">Serviços Adicionais:</p>
          <ul className={`list-value ${accessories.length > 2 ? '-withScroll' : ''}`}>
            {accessories.length === 0 ? (
              <li>Nenhum item selecionado</li>
            ) : (
              accessories.map((acc, index) => (
                <li key={index}>
                  <span className={`name ${acc.obrigatorio ? '-noSum' : ''}`}>
                    {(dailys > (acc.quantidadeMaximaDiariasSerCobrado || dailys) 
                      ? (acc.quantidadeMaximaDiariasSerCobrado || dailys) 
                      : dailys)}x {acc.quantidade || 0} Qtd. {acc.nome}
                  </span>
                  <span className={`price ${acc.obrigatorio ? '-noSum' : ''}`}>
                    {formatCurrency(
                      getAccessoryLineTotal(selectedCar.optionalAddonsData, dailys, acc)
                    )}
                  </span>
                </li>
              ))
            )}
          </ul>

          <p className="list-label">Proteções Adicionais:</p>
          <ul className="list-value">
            {protections.length === 0 ? (
              <li>Nenhum item selecionado</li>
            ) : (
              protections.map((p, index) => (
                <li key={index}>
                  <span>
                    {dailys}x {formatCurrency(p.valorDiaria || 0)} ({p.sigla || ''})
                  </span>
                  <span className="price">{formatCurrency(p.valorTotal || 0)}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {quantidadeHoraExtra !== 0 && (
          <p className="label">
            Horas Extra: <br />
            <span className="value">
              {quantidadeHoraExtra}x {formatCurrency(valorHoraExtraPorUnidade)}
            </span>
            <span className="price">{formatCurrency(valorHoraExtraTotal)}</span>
          </p>
        )}

        <p className="label">
          Taxa de Devolução: <br />
          <span className="value">(Taxa)</span>
          <span className="price">{formatCurrency(valorTaxaDevolucao)}</span>
        </p>

        {(percentualTaxaEventual > 0 || taxaAdministrativaValor > 0) && (
          <p className="label">
            Taxa Administrativa: <br />
            <span className="value">
              {percentualTaxaEventual > 0
                ? `(Taxa fixa de ${percentualTaxaEventual}%)`
                : '(Taxa)'}
            </span>
            <span className="price">{formatCurrency(taxaAdministrativaValor)}</span>
          </p>
        )}

        <p className="label">
          Valor Caução: <br />
          <span className="value">{formatCurrency(car.totalDepositValue || 0)}</span>
        </p>

        <p className="label">
          Valor da Franquia: <br />
          <span className="value">{formatCurrency(car.totalDeductibleValue || 0)}</span>
        </p>
      </div>

      <div className="sidebar-footer">
        <div className="price">
          <p className="label">Total:</p>
          <p className="value">{formatCurrency(totalRodape)}</p>
        </div>
        <p className="payment-card">
          {car.isMonthly 
            ? 'em até 3x sem juros'
            : 'em até 3x sem acréscimos ou de 4x a 12x, com pequenos acréscimos'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

