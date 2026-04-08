import type { OptionalAddonData } from '../services/api';

/** Campos usados no cálculo (compatível com Accessory de AccessoriesPage). */
export interface AccessoryPricingInput {
  nome: string;
  quantidade?: number;
  valorDiaria: number;
  quantidadeMaximaDiariasSerCobrado?: number;
}

/**
 * Valor da linha do acessório no período da cotação: usa totalValue da API (por unidade)
 * quando o addon existe; senão diária × diárias cobráveis × quantidade.
 */
export function getAccessoryLineTotal(
  optionalAddons: OptionalAddonData[] | undefined,
  rentalDays: number,
  acc: AccessoryPricingInput
): number {
  const qty = acc.quantidade || 0;
  if (qty <= 0) return 0;
  const addon = optionalAddons?.find((x) => x.name === acc.nome);
  if (addon) return addon.totalValue * qty;
  const maxChargeable = acc.quantidadeMaximaDiariasSerCobrado;
  const daysToCharge =
    maxChargeable && maxChargeable > 0
      ? Math.min(rentalDays, maxChargeable)
      : rentalDays;
  return (acc.valorDiaria || 0) * daysToCharge * qty;
}
