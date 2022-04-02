import React, {useContext, useState} from 'react';
import {AppState, AppStateVariant} from '../types/AppState';

// The global state for the app
const AppStateContext = React.createContext<
  [AppState, React.Dispatch<React.SetStateAction<AppState>>]
>([{mode: AppStateVariant.ArbiterSetup}, () => undefined]);

type AppStateHookType = [
  AppState,
  {enterTablePairingMode: (liveLinkUrl: string) => Promise<void>},
];

export const useAppState = (): AppStateHookType => {
  const [appState, setAppState] = useContext(AppStateContext);

  const enterTablePairingMode = async (liveLinkUrl: string) => {
    // TODO:
    // 1. Call live link url, and get PGN
    // 2. Parse PGN
    // 3. Set new game state
    console.log('Going to  seStaterver: ', liveLinkUrl);
    setAppState({mode: AppStateVariant.TablePairing, games: 0});
  };

  return [appState, {enterTablePairingMode}];
};

export const AppStateProvider: React.FC = ({children}) => {
  const appState = useState({
    mode: AppStateVariant.ArbiterSetup,
  } as AppState);

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};
