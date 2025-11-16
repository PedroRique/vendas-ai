import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { localizationService, type Partner, type LocationPlace } from '../services/localization';
import type { Agency } from '../services/api';
import { useAuth } from './useAuth';

interface UseLocalizationReturn {
  // Locadoras
  locadoras: Agency[];
  selectedLocadoras: string[];
  setSelectedLocadoras: (locadoras: string[]) => void;
  isLoadingLocadoras: boolean;
  
  // Franchise KM
  franchiseKmList: Partner[];
  franchiseKmListByCategory: Record<string, Partner[]>;
  selectedFranchiseKm: Partner | null;
  setSelectedFranchiseKm: (franchise: Partner | null) => void;
  
  // Locations
  getCarPlace: LocationPlace | null;
  retrievePlace: LocationPlace | null;
  getCarWhere: string;
  retrieveWhere: string;
  setGetCarWhere: (value: string) => void;
  setRetrieveWhere: (value: string) => void;
  locations: {
    airports: LocationPlace[];
    cities: LocationPlace[];
    districts: LocationPlace[];
    stores: LocationPlace[];
  };
  selectGetCarPlace: (place: LocationPlace) => void;
  selectRetrievePlace: (place: LocationPlace) => void;
  searchLocations: (search: string, forRetrieve?: boolean) => Promise<void>;
  
  // Dates
  getCarDate: Date;
  getCarHour: Date;
  retrieveDate: Date;
  retrieveHour: Date;
  minGetCarDate: Date;
  minRetrieveDate: Date;
  setGetCarDate: (date: Date) => void;
  setGetCarHour: (hour: Date) => void;
  setRetrieveDate: (date: Date) => void;
  setRetrieveHour: (hour: Date) => void;
  
  // Other
  coupon: string;
  setCoupon: (value: string) => void;
  showRetrieve: boolean;
  setShowRetrieve: (show: boolean) => void;
  
  // Status
  isLoading: boolean;
  isLoadingLocations: boolean;
  locationError: Error | null;
}

export const useLocalization = (agencyCode: number = 0): UseLocalizationReturn => {
  useAuth(); // Hook para manter o contexto, mas não precisamos do user aqui
  
  // Locadoras
  const [locadoras, setLocadoras] = useState<Agency[]>([]);
  const [selectedLocadoras, setSelectedLocadoras] = useState<string[]>([]);
  const [isLoadingLocadoras, setIsLoadingLocadoras] = useState(false);
  
  // Franchise KM
  const [franchiseKmList, setFranchiseKmList] = useState<Partner[]>([]);
  const [franchiseKmListByCategory, setFranchiseKmListByCategory] = useState<Record<string, Partner[]>>({});
  const [selectedFranchiseKm, setSelectedFranchiseKm] = useState<Partner | null>(null);
  
  // Locations
  const [getCarPlace, setGetCarPlace] = useState<LocationPlace | null>(null);
  const [retrievePlace, setRetrievePlace] = useState<LocationPlace | null>(null);
  const [getCarWhere, setGetCarWhere] = useState('');
  const [retrieveWhere, setRetrieveWhere] = useState('');
  const [locations, setLocations] = useState<{
    airports: LocationPlace[];
    cities: LocationPlace[];
    districts: LocationPlace[];
    stores: LocationPlace[];
  }>({
    airports: [],
    cities: [],
    districts: [],
    stores: [],
  });
  
  // Dates
  const minDate = dayjs().add(1, 'hour').startOf('hour').toDate();
  const initDate = dayjs().add(1, 'day').hour(10).minute(0).second(0).toDate();
  
  const [getCarDate, setGetCarDate] = useState<Date>(initDate);
  const [getCarHour, setGetCarHour] = useState<Date>(initDate);
  const [retrieveDate, setRetrieveDate] = useState<Date>(
    dayjs(initDate).add(1, 'day').hour(10).minute(0).second(0).toDate()
  );
  const [retrieveHour, setRetrieveHour] = useState<Date>(
    dayjs(initDate).add(1, 'day').hour(10).minute(0).second(0).toDate()
  );
  const [minGetCarDate] = useState<Date>(minDate);
  const [minRetrieveDate, setMinRetrieveDate] = useState<Date>(
    dayjs(minDate).add(1, 'hour').toDate()
  );
  
  // Other
  const [coupon, setCoupon] = useState('');
  const [showRetrieve, setShowRetrieve] = useState(false);
  
  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState<Error | null>(null);

  // Load locadoras on mount
  useEffect(() => {
    const loadLocadoras = async () => {
      setIsLoadingLocadoras(true);
      try {
        const locadorasList = await localizationService.getLocadoras();
        // Filtrar apenas as locadoras permitidas: Movida, Unidas, Localiza ou Foco
        // Os nomes devem corresponder exatamente ao campo nomeAgencia dos carros
        const allowedLocadoras = ['Movida', 'Unidas', 'Localiza', 'Foco'];
        const filtered = locadorasList.filter(loc => {
          const nome = loc.nome || loc.nomeAgencia || '';
          return allowedLocadoras.some(allowed => {
            const nomeLower = nome.toLowerCase().trim();
            const allowedLower = allowed.toLowerCase().trim();
            return nomeLower === allowedLower || nomeLower.includes(allowedLower) || allowedLower.includes(nomeLower);
          });
        });
        
        // Garantir que os nomes sejam exatamente como aparecem nos carros
        const normalized = filtered.map(loc => {
          const nome = loc.nome || loc.nomeAgencia || '';
          const nomeLower = nome.toLowerCase().trim();
          
          // Normalizar para o nome exato
          if (nomeLower.includes('movida')) return { ...loc, nome: 'Movida', nomeAgencia: 'Movida' };
          if (nomeLower.includes('unidas')) return { ...loc, nome: 'Unidas', nomeAgencia: 'Unidas' };
          if (nomeLower.includes('localiza')) return { ...loc, nome: 'Localiza', nomeAgencia: 'Localiza' };
          if (nomeLower.includes('foco')) return { ...loc, nome: 'Foco', nomeAgencia: 'Foco' };
          
          return loc;
        });
        
        setLocadoras(normalized);
      } catch (error) {
        console.error('Error loading locadoras:', error);
        // Em caso de erro, usar lista fixa como fallback
        setLocadoras([
          { codigo: 100, nome: 'Movida', nomeAgencia: 'Movida' },
          { codigo: 105, nome: 'Unidas', nomeAgencia: 'Unidas' },
          { codigo: 103, nome: 'Localiza', nomeAgencia: 'Localiza' },
          { codigo: 114, nome: 'Foco', nomeAgencia: 'Foco' },
        ]);
      } finally {
        setIsLoadingLocadoras(false);
      }
    };

    loadLocadoras();
  }, []);

  // Load franchise KM list on mount
  useEffect(() => {
    const loadFranchiseKm = async () => {
      setIsLoading(true);
      try {
        const partnersList = await localizationService.getPartners('');
        const grouped = localizationService.groupFranchiseKmByCategory(partnersList);
        setFranchiseKmListByCategory(grouped);
        
        // Default to MensalFlex
        setFranchiseKmList(grouped['MensalFlex'] || []);
      } catch (error) {
        console.error('Error loading franchise KM:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFranchiseKm();
  }, []);

  const selectGetCarPlace = useCallback((place: LocationPlace) => {
    setGetCarPlace(place);
    setGetCarWhere(place.nome);
  }, []);

  const selectRetrievePlace = useCallback((place: LocationPlace) => {
    setRetrievePlace(place);
    setRetrieveWhere(place.nome);
  }, []);

  const searchLocations = useCallback(async (search: string) => {
    if (search.length < 3) {
      setLocations({
        airports: [],
        cities: [],
        districts: [],
        stores: [],
      });
      setLocationError(null);
      return;
    }

    setIsLoadingLocations(true);
    setLocationError(null);
    try {
      const locadorasToUse = selectedLocadoras.length > 0 ? selectedLocadoras : undefined;
      const response = await localizationService.getLocations(search, agencyCode, locadorasToUse);
      
      // Process stores - preservar rentalCompanyId e rentalCompanyName se existirem
      const stores: LocationPlace[] = response.TodasLojas.map(loja => {
        const lojaWithCompany = loja as LocationPlace & { rentalCompanyId?: number; rentalCompanyName?: string };
        return {
          ...loja,
          qtLojas: 1,
          // Preservar rentalCompanyId e rentalCompanyName se existirem
          rentalCompanyId: lojaWithCompany.rentalCompanyId,
          rentalCompanyName: lojaWithCompany.rentalCompanyName,
        };
      });
      
      setLocations({
        airports: response.Aeroportos || [],
        cities: response.Cidades || [],
        districts: response.Bairro || [],
        stores,
      });
      
      // Verificar se há erros na resposta (mesmo com dados válidos)
      if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
        // Criar um erro agregado com todas as mensagens
        const errorMessages = response.errors
          .map((err: unknown) => {
            const error = err as { message?: string; code?: string };
            return error.message || `Erro ${error.code || 'desconhecido'}`;
          })
          .join('; ');
        const errorObj = new Error(errorMessages);
        // Adicionar os erros individuais como propriedade para acesso posterior
        (errorObj as Error & { apiErrors: unknown[] }).apiErrors = response.errors;
        setLocationError(errorObj);
      } else {
        setLocationError(null);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      const errorObj = error instanceof Error ? error : new Error('Erro ao buscar locais');
      
      // Preservar apiErrors se existirem no erro original
      if (error instanceof Error && 'apiErrors' in error) {
        (errorObj as Error & { apiErrors: unknown[] }).apiErrors = (error as Error & { apiErrors: unknown[] }).apiErrors;
        
        // Se houver apiErrors, ainda tentar processar dados se existirem
        // Mas isso só aconteceria se o searchStores retornasse dados mesmo com erro
        // Por enquanto, apenas definir o erro
      }
      
      setLocationError(errorObj);
      
      // Só limpar locations se realmente não houver dados
      // Se o erro tiver apiErrors mas também dados, os dados já foram processados acima
      // Mas como estamos no catch, significa que deu erro, então limpar
      setLocations({
        airports: [],
        cities: [],
        districts: [],
        stores: [],
      });
    } finally {
      setIsLoadingLocations(false);
    }
  }, [agencyCode, selectedLocadoras]);

  // Date validation and updates
  const handleGetCarDateChange = useCallback((date: Date) => {
    const newDate = dayjs(date);
    const currentHour = dayjs(getCarHour);
    const combinedDate = newDate.hour(currentHour.hour()).minute(currentHour.minute()).second(0);
    
    // Validate against min date
    if (combinedDate.isBefore(dayjs(minGetCarDate))) {
      const validatedDate = dayjs(minGetCarDate);
      setGetCarDate(validatedDate.toDate());
      setGetCarHour(validatedDate.toDate());
    } else {
      setGetCarDate(combinedDate.toDate());
      setGetCarHour(combinedDate.toDate());
    }

    // Update retrieve date if needed
    const currentRetrieve = dayjs(retrieveDate);
    const diff = currentRetrieve.diff(combinedDate, 'days');
    if (diff < 0) {
      const newRetrieveDate = combinedDate.add(1, 'day').hour(10).minute(0).second(0);
      setRetrieveDate(newRetrieveDate.toDate());
      setRetrieveHour(newRetrieveDate.toDate());
    } else if (diff === 0) {
      const diffHours = currentRetrieve.diff(combinedDate, 'hours');
      if (diffHours <= 0) {
        const newRetrieveHour = combinedDate.add(1, 'hour');
        setRetrieveDate(newRetrieveHour.toDate());
        setRetrieveHour(newRetrieveHour.toDate());
      }
    }

    // Update min retrieve date
    setMinRetrieveDate(combinedDate.add(1, 'hour').toDate());
  }, [getCarHour, minGetCarDate, retrieveDate]);

  const handleGetCarHourChange = useCallback((hour: Date) => {
    const newHour = dayjs(hour);
    const currentDate = dayjs(getCarDate);
    const combinedDate = currentDate.hour(newHour.hour()).minute(newHour.minute()).second(0);
    
    // Validate against min date
    if (combinedDate.isBefore(dayjs(minGetCarDate))) {
      const validatedDate = dayjs(minGetCarDate);
      setGetCarDate(validatedDate.toDate());
      setGetCarHour(validatedDate.toDate());
    } else {
      setGetCarDate(combinedDate.toDate());
      setGetCarHour(combinedDate.toDate());
    }

    // Update retrieve if needed
    const currentRetrieve = dayjs(retrieveHour);
    const diff = currentRetrieve.diff(combinedDate, 'hours');
    if (diff <= 0) {
      const newRetrieveDate = combinedDate.add(1, 'day');
      setRetrieveDate(newRetrieveDate.toDate());
      setRetrieveHour(newRetrieveDate.toDate());
    }

    // Update min retrieve date
    setMinRetrieveDate(combinedDate.add(1, 'hour').toDate());
  }, [getCarDate, minGetCarDate, retrieveHour]);

  const handleRetrieveDateChange = useCallback((date: Date) => {
    const newDate = dayjs(date);
    const currentHour = dayjs(retrieveHour);
    const combinedDate = newDate.hour(currentHour.hour()).minute(currentHour.minute()).second(0);
    const getCarFull = dayjs(getCarDate);
    
    const diff = combinedDate.diff(getCarFull, 'hours');
    if (diff <= 0) {
      const newRetrieveDate = getCarFull.add(1, 'day');
      setRetrieveDate(newRetrieveDate.toDate());
      setRetrieveHour(newRetrieveDate.toDate());
    } else {
      setRetrieveDate(combinedDate.toDate());
      setRetrieveHour(combinedDate.toDate());
    }
  }, [retrieveHour, getCarDate]);

  const handleRetrieveHourChange = useCallback((hour: Date) => {
    const newHour = dayjs(hour);
    const currentDate = dayjs(retrieveDate);
    const combinedDate = currentDate.hour(newHour.hour()).minute(newHour.minute()).second(0);
    const getCarFull = dayjs(getCarDate);
    
    const diff = combinedDate.diff(getCarFull, 'days');
    if (diff < 0) {
      const newRetrieveDate = getCarFull.add(1, 'day');
      setRetrieveDate(newRetrieveDate.toDate());
      setRetrieveHour(newRetrieveDate.toDate());
    } else if (diff === 0) {
      const diffHours = combinedDate.diff(getCarFull, 'hours');
      if (diffHours <= 0) {
        const newRetrieveHour = getCarFull.add(1, 'hour');
        setRetrieveDate(newRetrieveHour.toDate());
        setRetrieveHour(newRetrieveHour.toDate());
      } else {
        setRetrieveDate(combinedDate.toDate());
        setRetrieveHour(combinedDate.toDate());
      }
    } else {
      setRetrieveDate(combinedDate.toDate());
      setRetrieveHour(combinedDate.toDate());
    }
  }, [retrieveDate, getCarDate]);

  return {
    // Locadoras
    locadoras,
    selectedLocadoras,
    setSelectedLocadoras,
    isLoadingLocadoras,
    
    // Franchise KM
    franchiseKmList,
    franchiseKmListByCategory,
    selectedFranchiseKm,
    setSelectedFranchiseKm,
    
    // Locations
    getCarPlace,
    retrievePlace,
    getCarWhere,
    retrieveWhere,
    setGetCarWhere,
    setRetrieveWhere,
    locations,
    selectGetCarPlace,
    selectRetrievePlace,
    searchLocations,
    
    // Dates
    getCarDate,
    getCarHour,
    retrieveDate,
    retrieveHour,
    minGetCarDate,
    minRetrieveDate,
    setGetCarDate: handleGetCarDateChange,
    setGetCarHour: handleGetCarHourChange,
    setRetrieveDate: handleRetrieveDateChange,
    setRetrieveHour: handleRetrieveHourChange,
    
    // Other
    coupon,
    setCoupon,
    showRetrieve,
    setShowRetrieve,
    
    // Status
    isLoading,
    isLoadingLocations,
    locationError,
  };
};

