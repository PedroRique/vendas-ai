import type { BookingRequest, QuotationRequest } from '../services/api';
import { cleanCPF, cleanPassport } from './cpfMask';
import { cleanPhone } from './phoneMask';

interface FormatBookingData {
  selectedCar: {
    pesquisaLocacao: {
      dataHoraDevolucao: string;
      dataHoraRetirada: string;
      localRetiradaSigla: string;
      localDevolucaoSigla: string;
    };
    dadosVeiculo: {
      ehMensal?: boolean;
      codigoAcriss?: string;
      grupoVeiculo?: string;
      rateQualifier?: string;
      tokenCotacao?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  personal: {
    cpf?: string;
    passport?: string;
    name: string;
    tel: string;
    email: string;
    documentType: number;
    [key: string]: unknown;
  };
  accessories?: Array<Record<string, unknown>>;
  protection?: Array<Record<string, unknown>>;
  localization: {
    codCupom?: string;
    tarifas?: Array<Record<string, unknown>>;
    locaisRetirada?: string[];
    locaisDevolucao?: string[];
    [key: string]: unknown;
  };
  id_attendance: string;
  id_carrental?: number;
  idBooking?: boolean;
  codeBooking?: string;
  [key: string]: unknown;
}

/**
 * Formata os dados da reserva para o formato esperado pela API
 * Baseado no UtilService.formatBooking do sistema AngularJS
 */
export function formatBooking(data: FormatBookingData, isQuotation: boolean = false): BookingRequest | QuotationRequest {
  const documento = data.personal.cpf 
    ? cleanCPF(data.personal.cpf) 
    : (data.personal.passport ? cleanPassport(data.personal.passport) : '');

  // Extrair DDI e número do telefone
  // O telefone pode vir com DDI (ex: 00551234567890) ou sem DDI (ex: 11987654321)
  // Se tem DDI, remover (DDI brasileiro é 0055, então removemos 4 dígitos)
  // Caso contrário, usar os primeiros 2 dígitos como DDD
  let telClean = cleanPhone(data.personal.tel);
  
  // Se o telefone tem mais de 11 dígitos, provavelmente inclui DDI (0055...)
  // Remover DDI brasileiro (0055) se presente
  if (telClean.length > 11 && telClean.startsWith('0055')) {
    telClean = telClean.substring(4); // Remove "0055"
  }
  
  // Garantir que temos pelo menos 2 dígitos para DDD
  const dddCelular = telClean.length >= 2 ? telClean.substring(0, 2) : '';
  const celular = telClean.length >= 2 ? telClean.substring(2) : telClean;

  const booking: BookingRequest | QuotationRequest = {
    dataHoraDevolucao: data.selectedCar.pesquisaLocacao.dataHoraDevolucao,
    dataHoraRetirada: data.selectedCar.pesquisaLocacao.dataHoraRetirada,
    localRetirada: data.selectedCar.pesquisaLocacao.localRetiradaSigla,
    localDevolucao: data.selectedCar.pesquisaLocacao.localDevolucaoSigla,
    ehMensal: data.selectedCar.dadosVeiculo.ehMensal,
    dadosCliente: {
      email: data.personal.email,
      prefixoNome: data.personal.name.substring(0, 1),
      nome: data.personal.name,
      sobrenome: data.personal.name,
      dddTelefone: '',
      telefone: '',
      dddCelular: dddCelular,
      Celular: celular,
      tipoDocumento: data.personal.documentType,
      documento: documento,
    },
    codigoAcriss: data.selectedCar.dadosVeiculo.codigoAcriss,
    categoria: data.selectedCar.dadosVeiculo.grupoVeiculo,
    opcionais: data.accessories || [],
    protecoes: data.protection || [],
    codigoPromocional: data.localization.codCupom,
    tarifas: data.localization.tarifas || [],
    rateQualifier: data.selectedCar.dadosVeiculo.rateQualifier,
    tokenCotacao: data.selectedCar.dadosVeiculo.tokenCotacao,
    protocolo: data.id_attendance,
  };

  if (isQuotation) {
    (booking as QuotationRequest).codCupom = booking.codigoPromocional;
    (booking as QuotationRequest).locaisRetirada = data.localization.locaisRetirada || [];
    (booking as QuotationRequest).locaisDevolucao = data.localization.locaisDevolucao || [];
  }

  if (data.idBooking && data.codeBooking) {
    booking.codigoReservaAgencia = data.codeBooking;
  }

  return booking;
}

