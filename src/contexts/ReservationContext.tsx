import React, { useState, useMemo, type ReactNode } from 'react';
import { ReservationContext, type LocalizationFormState } from './reservationContextValue';

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [localizationFormState, setLocalizationFormState] = useState<LocalizationFormState | null>(null);

  const clearReservationState = () => {
    setLocalizationFormState(null);
  };

  const contextValue = useMemo(
    () => ({
      localizationFormState,
      setLocalizationFormState,
      clearReservationState,
    }),
    [localizationFormState]
  );

  return (
    <ReservationContext.Provider value={contextValue}>
      {children}
    </ReservationContext.Provider>
  );
};

