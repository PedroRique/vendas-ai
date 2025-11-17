import { createContext } from 'react';
import type { LocationPlace, Partner } from '../services/localization';

export interface LocalizationFormState {
  // Locadoras
  selectedLocadoras: string[];
  
  // Franchise KM
  selectedFranchiseKm: Partner | null;
  
  // Locations
  getCarPlace: LocationPlace | null;
  retrievePlace: LocationPlace | null;
  getCarWhere: string;
  retrieveWhere: string;
  
  // Dates
  getCarDate: Date | null;
  getCarHour: Date | null;
  retrieveDate: Date | null;
  retrieveHour: Date | null;
  
  // Other
  coupon: string;
  showRetrieve: boolean;
}

export interface ReservationContextType {
  localizationFormState: LocalizationFormState | null;
  setLocalizationFormState: (state: LocalizationFormState | null) => void;
  clearReservationState: () => void;
}

export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

