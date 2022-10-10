import React, { useContext, useEffect, useState } from 'react';
import { ArbiterInfo } from '../types/ArbiterInfoState';
import { getStoredArbiterInfo, storeArbiterInfo } from '../util/storage';

const ArbiterInfoContext = React.createContext<
  [ArbiterInfo | null, React.Dispatch<React.SetStateAction<ArbiterInfo | null>>]
>([null, () => undefined]);

// Global state for the app
// Quite extranous, but easier to read than useContext(ArbiterInfo)
export const useArbiterInfo = (): [
  ArbiterInfo | null,
  (arbiterInfo: ArbiterInfo) => Promise<void>,
] => {
  const [arbiterInfoContext, setArbiterInfoContext] =
    useContext(ArbiterInfoContext);

  const setArbiterInfo = async (arbiterInfo: ArbiterInfo): Promise<void> => {
    setArbiterInfoContext(arbiterInfo);
    await storeArbiterInfo(arbiterInfo);
  };

  return [arbiterInfoContext, setArbiterInfo];
};

export const ArbiterInfoContextProvider: React.FC = ({ children }) => {
  const [arbiterInfoState, setArbiterInfoState] = useState<ArbiterInfo | null>(
    null,
  );

  useEffect(() => {
    getStoredArbiterInfo().then(arbiterInfo => {
      if (arbiterInfo) {
        setArbiterInfoState(arbiterInfo);
      }
    });
  }, []);
  return (
    <ArbiterInfoContext.Provider
      value={[arbiterInfoState, setArbiterInfoState]}>
      {children}
    </ArbiterInfoContext.Provider>
  );
};
