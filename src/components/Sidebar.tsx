import React, { useMemo, useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import type { Protection } from './ProtectionsPage';
import type { PersonalData } from './PersonalDataPage';
import './Sidebar.scss';

interface LocalizationData {
  dataHoraRetirada?: string;
  dataHoraDevolucao?: string;
  codCupom?: string;
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
  const [totalValue, setTotalValue] = useState(0);
  const [adminTax, setAdminTax] = useState(0);
  const [valorHoraExtra, setValorHoraExtra] = useState(0);
  const [valorTaxaDevolucao, setValorTaxaDevolucao] = useState(0);

  const car = selectedCar.vehicleData;
  const rentalSearch = selectedCar.rentalSearch;
  const dailys = car.numberOfDays || 0;

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

  // Calcular valor de acessório
  const calcAccessoriesView = (acc: Accessory) => {
    const dailysToUse = dailys > (acc.quantidadeMaximaDiariasSerCobrado || dailys) 
      ? (acc.quantidadeMaximaDiariasSerCobrado || dailys) 
      : dailys;
    return dailysToUse * (acc.valorDiaria || 0) * (acc.quantidade || 0);
  };

  // Calcular taxa administrativa
  const calcAdminTax = useMemo(() => {
    const valorDiaria = car.totalMonthlyDailyRateValue || car.totalValue || 0;
    const valorProtecao = protections.reduce((sum, p) => sum + (p.valorTotal || 0), 0);
    const valorOpcionais = accessories.reduce((sum, a) => sum + ((a.valorTotal || 0) * (a.quantidade || 0)), 0);
    const valorHoraExtraCalc = valorHoraExtra;
    const valorTaxaDevolucaoCalc = valorTaxaDevolucao;

    const baseValue = valorDiaria + valorOpcionais + valorProtecao + valorTaxaDevolucaoCalc + valorHoraExtraCalc;
    const percentualTaxaEventual = car.administrativeFeePercentage || 0;
    const totalPorcento = (baseValue * percentualTaxaEventual) / 100;

    return totalPorcento;
  }, [car, accessories, protections, valorHoraExtra, valorTaxaDevolucao]);

  // Calcular valor das horas extras
  const calcValorHoraExtra = useMemo(() => {
    const valorProtecao = protections.reduce((sum, p) => sum + (p.valorTotal || 0), 0);
    const quantidadeDiarias = car.numberOfDays || 0;
    const quantidadeHoraExtra = car.numberOfOvertimeHours || 0;
    const valorTotalHoraExtra = car.totalOvertimeValue || 0;
    const percentualTaxaHoraExtraProtecao = car.overtimeCoverageFeePercentage || 0;

    if (quantidadeDiarias > 0 && quantidadeHoraExtra > 0) {
      const valorHoraExtraCalc = quantidadeHoraExtra * (
        ((valorProtecao / quantidadeDiarias) * (percentualTaxaHoraExtraProtecao / 100)) +
        valorTotalHoraExtra
      );
      return valorHoraExtraCalc;
    }

    return 0;
  }, [car, protections]);

  // Calcular valor total
  useEffect(() => {
    const valorDiaria = car.totalMonthlyDailyRateValue || car.totalValue || 0;
    const valorProtecao = protections.reduce((sum, p) => sum + (p.valorTotal || 0), 0);
    const valorOpcionais = accessories.reduce((sum, a) => sum + ((a.valorTotal || 0) * (a.quantidade || 0)), 0);
    const valorTaxaDevolucaoCalc = car.returnFeeValue || valorTaxaDevolucao || 0;
    const valorHoraExtraCalc = calcValorHoraExtra;

    const baseValue = valorDiaria + valorOpcionais + valorProtecao + valorTaxaDevolucaoCalc + valorHoraExtraCalc;
    const adminTaxCalc = calcAdminTax;
    const total = baseValue + adminTaxCalc;

    setTotalValue(total);
    setAdminTax(adminTaxCalc);
    setValorHoraExtra(valorHoraExtraCalc);
    setValorTaxaDevolucao(valorTaxaDevolucaoCalc);
  }, [car, accessories, protections, calcAdminTax, calcValorHoraExtra, valorTaxaDevolucao]);

  // Copiar dados da sidebar
  const handleCopyData = () => {
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      const texto = sidebarElement.textContent || '';
      
      navigator.clipboard.writeText(texto).then(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Copiado',
          detail: 'Copiado para área de transferência.',
        });
      }).catch(() => {
        // Fallback para navegadores mais antigos
        const el = document.createElement('textarea');
        el.value = texto;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        toast.current?.show({
          severity: 'success',
          summary: 'Copiado',
          detail: 'Copiado para área de transferência.',
        });
      });
    }
  };

  const valorDiariaPorUnidade = dailys > 0 ? (car.totalMonthlyDailyRateValue || car.totalValue || 0) / dailys : 0;
  const quantidadeHoraExtra = car.numberOfOvertimeHours || 0;
  const valorHoraExtraPorUnidade = quantidadeHoraExtra > 0 ? valorHoraExtra / quantidadeHoraExtra : 0;
  const percentualTaxaEventual = car.administrativeFeePercentage || 0;

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

        {rentalSearch?.pickupStoreName && (
          <p className="label">
            Local Retirada: <br />
            <span className="value">{rentalSearch.pickupStoreName}</span>
          </p>
        )}

        {localizationData?.dataHoraDevolucao && (
          <p className="label">
            Data Devolução: <br />
            <span className="value">{formatDateTime(localizationData.dataHoraDevolucao)}</span>
          </p>
        )}

        {rentalSearch?.returnStoreName && (
          <p className="label">
            Local Devolução: <br />
            <span className="value">{rentalSearch.returnStoreName}</span>
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
          <span className="price">{formatCurrency(car.totalMonthlyDailyRateValue || car.totalValue || 0)}</span>
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
                    {formatCurrency(calcAccessoriesView(acc))}
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
            <span className="price">{formatCurrency(valorHoraExtra)}</span>
          </p>
        )}

        <p className="label">
          Taxa de Devolução: <br />
          <span className="value">(Taxa)</span>
          <span className="price">{formatCurrency(car.returnFeeValue || valorTaxaDevolucao)}</span>
        </p>

        {percentualTaxaEventual > 0 && (
          <p className="label">
            Taxa Administrativa: <br />
            <span className="value">(Taxa fixa de {percentualTaxaEventual}%)</span>
            <span className="price">{formatCurrency(adminTax)}</span>
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
          <p className="value">{formatCurrency(totalValue)}</p>
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

