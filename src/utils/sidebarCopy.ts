import type { Accessory } from '../components/AccessoriesPage';
import type { Protection } from '../components/ProtectionsPage';
import type { PersonalData } from '../components/PersonalDataPage';
import type { OptionalAddonData, VehicleData } from '../services/api';
import { getAccessoryLineTotal } from './accessoryPricing';

export interface SidebarLocalizationForCopy {
  dataHoraRetirada?: string;
  dataHoraDevolucao?: string;
  codCupom?: string;
  franquiaKM?: { codigo?: string };
}

export interface SidebarCopyInput {
  personalData?: PersonalData;
  localizationData?: SidebarLocalizationForCopy;
  pickupLocationLabel: string;
  returnLocationLabel: string;
  car: VehicleData;
  optionalAddonsData?: OptionalAddonData[];
  dailys: number;
  valorDiariaPorUnidade: number;
  valorTotalDiariasCalculado: number;
  accessories: Accessory[];
  protections: Protection[];
  quantidadeHoraExtra: number;
  valorHoraExtraPorUnidade: number;
  valorHoraExtraTotal: number;
  valorTaxaDevolucao: number;
  percentualTaxaEventual: number;
  taxaAdministrativaValor: number;
  totalRodape: number;
}

function formatDateTime(dateTime?: string): string {
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
}

function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Texto para colar (WhatsApp etc.): monta linhas com \n — não usar textContent do DOM.
 */
export function buildSidebarCopyText(input: SidebarCopyInput): string {
  const {
    personalData,
    localizationData,
    pickupLocationLabel,
    returnLocationLabel,
    car,
    optionalAddonsData,
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
  } = input;

  const lines: string[] = [];

  if (personalData?.name) {
    lines.push(`Nome: ${personalData.name}`);
  }

  lines.push(`Descrição: ${car.vehicleGroup || '--'}`);
  lines.push(`Modelo: ${car.model || '--'}`);

  if (localizationData?.franquiaKM?.codigo) {
    lines.push(`Franquia: ${localizationData.franquiaKM.codigo} Km/mês`);
  }

  if (localizationData?.dataHoraRetirada) {
    lines.push(`Data de Retirada: ${formatDateTime(localizationData.dataHoraRetirada)}`);
  }
  if (pickupLocationLabel) {
    lines.push(`Local Retirada: ${pickupLocationLabel}`);
  }
  if (localizationData?.dataHoraDevolucao) {
    lines.push(`Data Devolução: ${formatDateTime(localizationData.dataHoraDevolucao)}`);
  }
  if (returnLocationLabel) {
    lines.push(`Local Devolução: ${returnLocationLabel}`);
  }
  if (localizationData?.codCupom) {
    lines.push(`Cupom de Desconto: ${String(localizationData.codCupom)}`);
  }

  lines.push(
    `Diárias: ${dailys}x ${formatCurrency(valorDiariaPorUnidade)} — ${formatCurrency(valorTotalDiariasCalculado)}`
  );

  lines.push('Serviços Adicionais:');
  if (accessories.length === 0) {
    lines.push('  Nenhum item selecionado');
  } else {
    accessories.forEach((acc) => {
      const dailysToUse =
        dailys > (acc.quantidadeMaximaDiariasSerCobrado || dailys)
          ? acc.quantidadeMaximaDiariasSerCobrado || dailys
          : dailys;
      lines.push(
        `  ${dailysToUse}x ${acc.quantidade || 0} Qtd. ${acc.nome} — ${formatCurrency(
          getAccessoryLineTotal(optionalAddonsData, dailys, acc)
        )}`
      );
    });
  }

  lines.push('Proteções Adicionais:');
  if (protections.length === 0) {
    lines.push('  Nenhum item selecionado');
  } else {
    protections.forEach((p) => {
      lines.push(
        `  ${dailys}x ${formatCurrency(p.valorDiaria || 0)} (${p.sigla || ''}) — ${formatCurrency(p.valorTotal || 0)}`
      );
    });
  }

  if (quantidadeHoraExtra !== 0) {
    lines.push(
      `Horas Extra: ${quantidadeHoraExtra}x ${formatCurrency(valorHoraExtraPorUnidade)} — ${formatCurrency(valorHoraExtraTotal)}`
    );
  }

  lines.push(`Taxa de Devolução: ${formatCurrency(valorTaxaDevolucao)}`);

  if (percentualTaxaEventual > 0 || taxaAdministrativaValor > 0) {
    const detalhe =
      percentualTaxaEventual > 0
        ? `Taxa fixa de ${percentualTaxaEventual}%`
        : 'Taxa';
    lines.push(`Taxa Administrativa (${detalhe}): ${formatCurrency(taxaAdministrativaValor)}`);
  }

  lines.push(`Valor Caução: ${formatCurrency(car.totalDepositValue || 0)}`);
  lines.push(`Valor da Franquia: ${formatCurrency(car.totalDeductibleValue || 0)}`);

  lines.push(`Total: ${formatCurrency(totalRodape)}`);

  lines.push(
    car.isMonthly
      ? 'em até 3x sem juros'
      : 'em até 3x sem acréscimos ou de 4x a 12x, com pequenos acréscimos'
  );

  return lines.join('\n');
}

/** Mesmo padrão do CarList: Clipboard API + fallback textarea. */
export async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
