import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { localizationService, type Partner, type LocationPlace } from '../services/localization';
import { useAuth } from './useAuth';

interface UseLocalizationReturn {
  // Partners
  partners: Partner[];
  partnerFiltered: Partner[];
  selectedPartner: Partner | null;
  partnerInput: string;
  setPartnerInput: (value: string) => void;
  selectPartner: (partner: Partner) => void;
  clearPartner: () => void;
  
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
}

export const useLocalization = (agencyCode: number = 0): UseLocalizationReturn => {
  const { user } = useAuth();
  
  // Partners
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerFiltered, setPartnerFiltered] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerInput, setPartnerInput] = useState('');
  
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
  const [minGetCarDate, setMinGetCarDate] = useState<Date>(minDate);
  const [minRetrieveDate, setMinRetrieveDate] = useState<Date>(
    dayjs(minDate).add(1, 'hour').toDate()
  );
  
  // Other
  const [coupon, setCoupon] = useState('');
  const [showRetrieve, setShowRetrieve] = useState(false);
  
  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Load partners on mount
  useEffect(() => {
    const loadPartners = async () => {
      setIsLoading(true);
      try {
        const partnersList = await localizationService.getPartners('');
        const filtered = partnersList.filter(p => p.categoria === 'Parceria');
        setPartners(filtered);
        
        const grouped = localizationService.groupFranchiseKmByCategory(partnersList);
        setFranchiseKmListByCategory(grouped);
        
        // Default to MensalFlex
        setFranchiseKmList(grouped['MensalFlex'] || []);
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPartners();
  }, []);

  // Filter partners when input changes
  useEffect(() => {
    if (partnerInput.length >= 1) {
      const filtered = localizationService.filterPartners(partners, partnerInput);
      setPartnerFiltered(filtered);
    } else {
      setPartnerFiltered([]);
    }
  }, [partnerInput, partners]);

  // Update franchise list when partner changes
  useEffect(() => {
    if (selectedPartner) {
      const codigo99Movida = '1829626';
      const codigoUberMovida = '971697';
      const codigo99Moover = '6788009';
      const codigoUberMoover = '6788053';
      const codigoMovidaCargo = '6788075';
      
      let category = 'MensalFlex';
      
      if (
        selectedPartner.codigo === codigo99Movida ||
        selectedPartner.codigo === codigoUberMovida ||
        selectedPartner.codigo === codigo99Moover ||
        selectedPartner.codigo === codigoUberMoover
      ) {
        category = 'App';
      } else if (selectedPartner.codigo === codigoMovidaCargo) {
        category = 'KM';
      }
      
      setFranchiseKmList(franchiseKmListByCategory[category] || []);
    } else {
      setFranchiseKmList(franchiseKmListByCategory['MensalFlex'] || []);
    }
  }, [selectedPartner, franchiseKmListByCategory]);

  const selectPartner = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setPartnerInput(partner.descricao);
  }, []);

  const clearPartner = useCallback(() => {
    setSelectedPartner(null);
    setPartnerInput('');
    setFranchiseKmList(franchiseKmListByCategory['MensalFlex'] || []);
  }, [franchiseKmListByCategory]);

  const selectGetCarPlace = useCallback((place: LocationPlace) => {
    setGetCarPlace(place);
    setGetCarWhere(place.nome);
  }, []);

  const selectRetrievePlace = useCallback((place: LocationPlace) => {
    setRetrievePlace(place);
    setRetrieveWhere(place.nome);
  }, []);

  const searchLocations = useCallback(async (search: string, forRetrieve: boolean = false) => {
    if (search.length < 3) {
      setLocations({
        airports: [],
        cities: [],
        districts: [],
        stores: [],
      });
      return;
    }

    setIsLoadingLocations(true);
    try {
      const parceria = selectedPartner?.codigo;
      const response = await localizationService.getLocations(search, agencyCode, parceria);
      
      // Process stores
      const stores: LocationPlace[] = response.TodasLojas.map(loja => ({
        ...loja,
        qtLojas: 1,
      }));
      
      setLocations({
        airports: response.Aeroportos || [],
        cities: response.Cidades || [],
        districts: response.Bairro || [],
        stores,
      });
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocations({
        airports: [],
        cities: [],
        districts: [],
        stores: [],
      });
    } finally {
      setIsLoadingLocations(false);
    }
  }, [agencyCode, selectedPartner]);

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
    // Partners
    partners,
    partnerFiltered,
    selectedPartner,
    partnerInput,
    setPartnerInput,
    selectPartner,
    clearPartner,
    
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
  };
};

