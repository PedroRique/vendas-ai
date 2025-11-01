/**
 * Valida CPF brasileiro
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) {
    return false;
  }

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]+/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Verifica se são todos iguais
  if (
    cleanCPF === '00000000000' ||
    cleanCPF === '11111111111' ||
    cleanCPF === '22222222222' ||
    cleanCPF === '33333333333' ||
    cleanCPF === '44444444444' ||
    cleanCPF === '55555555555' ||
    cleanCPF === '66666666666' ||
    cleanCPF === '77777777777' ||
    cleanCPF === '88888888888' ||
    cleanCPF === '99999999999'
  ) {
    return false;
  }

  // Valida primeiro dígito verificador
  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }

  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(9))) return false;

  // Valida segundo dígito verificador
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }

  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

