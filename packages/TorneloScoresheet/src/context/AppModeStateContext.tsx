import React, { useContext, useState } from 'react';
import { makeUseEnterPgnState } from '../hooks/appMode/EnterPgnState';
import { makeUsePairingSelectionState } from '../hooks/appMode/PairingSelectionState';
import { AppModeState, AppMode } from '../types/AppModeState';

// The global state for the app
// This is not exported so the setAppModeState is never leaked
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([{ mode: AppMode.EnterPgn }, () => undefined]);

type AppModeStateHookType = [AppModeState];

export const useAppModeState = (): AppModeStateHookType => {
  const [appModeState] = useContext(AppModeStateContext);

  return [appModeState];
};

export const AppModeStateContextProvider: React.FC = ({ children }) => {
  const appModeState = useState({
    mode: AppMode.EnterPgn,
  } as AppModeState);

  return (
    <AppModeStateContext.Provider value={appModeState}>
      {children}
    </AppModeStateContext.Provider>
  );
};

// state creations
export const useEnterPgnState = makeUseEnterPgnState(AppModeStateContext);
export const usePairingSelectionState =
  makeUsePairingSelectionState(AppModeStateContext);
