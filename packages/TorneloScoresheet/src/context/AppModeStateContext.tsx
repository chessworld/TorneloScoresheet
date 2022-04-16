import React, { useContext, useState } from 'react';
import { AppModeState, AppMode } from '../types/AppModeState';

// The global state for the app
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([{ mode: AppMode.ArbiterSetup }, () => undefined]);

type AppModeStateHookType = [
  AppModeState,
  { enterTablePairingMode: (liveLinkUrl: string) => Promise<void> },
];

export const useAppModeState = (): AppModeStateHookType => {
  const [appModeState, setAppModeState] = useContext(AppModeStateContext);

  const enterTablePairingMode = async (liveLinkUrl: string) => {
    // TODO:
    // 1. Call live link url, and get PGN
    // 2. Parse PGN
    // 3. Set new game state
    console.log('Going to Tornelo server: ', liveLinkUrl);
    setAppModeState({ mode: AppMode.TablePairing, games: 0 });
  };

  return [appModeState, { enterTablePairingMode }];
};

export const AppModeStateContextProvider: React.FC = ({ children }) => {
  const appModeState = useState({
    mode: AppMode.ArbiterSetup,
  } as AppModeState);

  return (
    <AppModeStateContext.Provider value={appModeState}>
      {children}
    </AppModeStateContext.Provider>
  );
};
