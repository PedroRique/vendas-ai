// Lista de DDI (códigos de países) - versão simplificada com os principais
export interface DDIOption {
  codigo: string;
  fone: string;
  iso: string;
  iso3: string;
  nome: string;
  nomeFormal: string;
}

export const DDI_LIST: DDIOption[] = [
  { codigo: '076', fone: '0055', iso: 'BR', iso3: 'BRA', nome: 'Brasil', nomeFormal: 'República Federativa do Brasil' },
  { codigo: '840', fone: '0001', iso: 'US', iso3: 'USA', nome: 'Estados Unidos, Canadá', nomeFormal: 'Estados Unidos da América' },
  { codigo: '826', fone: '0044', iso: 'GB', iso3: 'GBR', nome: 'Reino Unido', nomeFormal: 'Reino Unido da Grã-Bretanha e Irlanda do Norte' },
  { codigo: '032', fone: '0054', iso: 'AR', iso3: 'ARG', nome: 'Argentina', nomeFormal: 'República Argentina' },
  { codigo: '152', fone: '0056', iso: 'CL', iso3: 'CHL', nome: 'Chile', nomeFormal: 'República do Chile' },
  { codigo: '484', fone: '0052', iso: 'MX', iso3: 'MEX', nome: 'México', nomeFormal: 'Estados Unidos Mexicanos' },
  { codigo: '604', fone: '0051', iso: 'PE', iso3: 'PER', nome: 'Peru', nomeFormal: 'República do Peru' },
  { codigo: '218', fone: '0593', iso: 'EC', iso3: 'ECU', nome: 'Equador', nomeFormal: 'República do Equador' },
  { codigo: '600', fone: '0595', iso: 'PY', iso3: 'PRY', nome: 'Paraguai', nomeFormal: 'República do Paraguai' },
  { codigo: '858', fone: '0598', iso: 'UY', iso3: 'URY', nome: 'Uruguai', nomeFormal: 'República Oriental do Uruguai' },
  { codigo: '170', fone: '0057', iso: 'CO', iso3: 'COL', nome: 'Colômbia', nomeFormal: 'República da Colômbia' },
  { codigo: '862', fone: '0058', iso: 'VE', iso3: 'VEN', nome: 'Venezuela', nomeFormal: 'República Bolivariana da Venezuela' },
  { codigo: '250', fone: '0033', iso: 'FR', iso3: 'FRA', nome: 'França', nomeFormal: 'República Francesa' },
  { codigo: '380', fone: '0039', iso: 'IT', iso3: 'ITA', nome: 'Italia', nomeFormal: 'República Italiana' },
  { codigo: '276', fone: '0049', iso: 'DE', iso3: 'DEU', nome: 'Alemanha', nomeFormal: 'República Federal da Alemanha' },
  { codigo: '724', fone: '0034', iso: 'ES', iso3: 'ESP', nome: 'Espanha', nomeFormal: 'Reino da Espanha' },
  { codigo: '392', fone: '0081', iso: 'JP', iso3: 'JPN', nome: 'Japão', nomeFormal: 'Japão' },
  { codigo: '156', fone: '0086', iso: 'CN', iso3: 'CHN', nome: 'China', nomeFormal: 'República Popular da China' },
  { codigo: '752', fone: '0046', iso: 'SE', iso3: 'SWE', nome: 'Suécia', nomeFormal: 'Reino da Suécia' },
  { codigo: '578', fone: '0047', iso: 'NO', iso3: 'NOR', nome: 'Noruega', nomeFormal: 'Reino da Noruega' },
  { codigo: '203', fone: '0420', iso: 'CZ', iso3: 'CZE', nome: 'República Tcheca', nomeFormal: 'República Tcheca' },
  { codigo: '348', fone: '0036', iso: 'HU', iso3: 'HUN', nome: 'Hungria', nomeFormal: 'Hungria' },
  { codigo: '792', fone: '0090', iso: 'TR', iso3: 'TUR', nome: 'Turquia', nomeFormal: 'República da Turquia' },
  { codigo: '040', fone: '0043', iso: 'AT', iso3: 'AUT', nome: 'Áustria', nomeFormal: 'República da Áustria' },
  { codigo: '300', fone: '0030', iso: 'GR', iso3: 'GRC', nome: 'Grécia', nomeFormal: 'República Helênica' },
  { codigo: '702', fone: '0065', iso: 'SG', iso3: 'SGP', nome: 'Singapura', nomeFormal: 'República da Singapura' },
  { codigo: '356', fone: '0091', iso: 'IN', iso3: 'IND', nome: 'Índia', nomeFormal: 'República da Índia' },
  { codigo: '410', fone: '0082', iso: 'KR', iso3: 'KOR', nome: 'Coreia do Sul', nomeFormal: 'República da Coreia' },
  { codigo: '036', fone: '0061', iso: 'AU', iso3: 'AUS', nome: 'Austrália', nomeFormal: 'Comunidade da Austrália' },
  { codigo: '554', fone: '0064', iso: 'NZ', iso3: 'NZL', nome: 'Nova Zelândia', nomeFormal: 'Nova Zelândia' },
];

// Ordenar por código de telefone
export const SORTED_DDI_LIST = [...DDI_LIST].sort((a, b) => {
  return parseInt(a.fone) - parseInt(b.fone);
});

