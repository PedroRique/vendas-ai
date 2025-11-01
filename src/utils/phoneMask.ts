/**
 * Formata telefone brasileiro
 */
export function formatPhoneBR(value: string): string {
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (DDD + número)
  const limited = numbers.slice(0, 11);
  
  // Aplica máscara: (XX) XXXXX-XXXX
  if (limited.length <= 10) {
    return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  }
  return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
}

/**
 * Remove máscara do telefone
 */
export function cleanPhone(value: string): string {
  return value.replace(/\D/g, '');
}

