/**
 * Formata CPF: XXX.XXX.XXX-XX
 */
export function formatCPF(value: string): string {
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);
  
  // Aplica máscara
  return limited.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').trim();
}

/**
 * Remove máscara do CPF
 */
export function cleanCPF(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Remove caracteres especiais do passaporte (mantém apenas letras, números e hífen)
 */
export function cleanPassport(value: string): string {
  return value.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase();
}

