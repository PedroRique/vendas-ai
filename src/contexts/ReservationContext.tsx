import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { LocationPlace } from '../services/localization';
import type { Partner } from '../services/localization';

interface LocalizationFormState {
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

interface ReservationContextType {
  localizationFormState: LocalizationFormState | null;
  setLocalizationFormState: (state: LocalizationFormState | null) => void;
  clearReservationState: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [localizationFormState, setLocalizationFormState] = useState<LocalizationFormState | null>(null);

  const clearReservationState = () => {
    setLocalizationFormState(null);
  };

  return (
    <ReservationContext.Provider
      value={{
        localizationFormState,
        setLocalizationFormState,
        clearReservationState,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

