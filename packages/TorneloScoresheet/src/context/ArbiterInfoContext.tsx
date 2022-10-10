import React, { useContext, useState } from 'react';
import { ArbiterInfo } from '../types/ArbiterInfoState';

const ArbiterInfoContext = React.createContext<
  [
    ArbiterInfo | undefined,
    React.Dispatch<React.SetStateAction<ArbiterInfo | undefined>>,
  ]
>([undefined, () => undefined]);

// Global state for the app
// Quite extranous, but easier to read than useContext(ArbiterInfo)
export const useArbiterInfo = (): [
  ArbiterInfo | undefined,
  (arbiterInfo: ArbiterInfo) => void,
] => useContext(ArbiterInfoContext);

export const ArbiterInfoContextProvider: React.FC = ({ children }) => {
  const arbiterInfoState = useState<ArbiterInfo | undefined>(undefined);
  return (
    <ArbiterInfoContext.Provider value={arbiterInfoState}>
      {children}
    </ArbiterInfoContext.Provider>
  );
};
