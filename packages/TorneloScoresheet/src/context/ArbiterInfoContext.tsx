import React, { useContext, useState } from 'react';
import { ArbiterInfo } from '../types/ArbiterInfoState';

const ArbiterInfoContext = React.createContext<
  [ArbiterInfo, React.Dispatch<React.SetStateAction<ArbiterInfo>>]
>([{}, () => undefined]);

// Global state for the app
// Quite extranous, but easier to read than useContext(ArbiterInfo)
export const useArbiterInfo = (): [
  ArbiterInfo,
  (arbiterInfo: ArbiterInfo) => void,
] => useContext(ArbiterInfoContext);

export const ArbiterInfoContextProvider: React.FC = ({ children }) => {
  const arbiterInfoState = useState<ArbiterInfo>({});
  return (
    <ArbiterInfoContext.Provider value={arbiterInfoState}>
      {children}
    </ArbiterInfoContext.Provider>
  );
};
