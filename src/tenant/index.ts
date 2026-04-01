import { alugueldecarroConfig } from './alugueldecarro.config';
import { focoConfig } from './foco.config';
import type { TenantConfig, TenantId } from './types';

const TENANTS: Record<TenantId, TenantConfig> = {
  alugueldecarro: alugueldecarroConfig,
  foco: focoConfig,
};

function resolveTenantId(): TenantId {
  const raw = import.meta.env.VITE_TENANT;
  if (raw === 'foco') return 'foco';
  return 'alugueldecarro';
}

export const tenantId: TenantId = resolveTenantId();
export const tenant: TenantConfig = TENANTS[tenantId];

export type { TenantConfig, TenantId };
