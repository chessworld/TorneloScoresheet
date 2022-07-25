import React, { useContext, useState } from 'react';
import { makeUseEnterPgnState } from '../hooks/appMode/enterPgnState';
import { makeUsePairingSelectionState } from '../hooks/appMode/pairingSelectionState';
import { makeUseTablePairingState } from '../hooks/appMode/tablePairingState';
import { makeUseGraphicalRecordingState } from '../hooks/appMode/graphicalRecordingState';
import { AppModeState, AppMode } from '../types/AppModeState';
import { makeUseResultDisplayState } from '../hooks/appMode/resultDisplayState';

// The global state for the app
// This is not exported so the setAppModeState is never leaked
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([{ mode: AppMode.EnterPgn }, () => undefined]);

export const useAppModeState = (): AppModeState => {
  const [appModeState] = useContext(AppModeStateContext);

  return appModeState;
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

export const useTablePairingState =
  makeUseTablePairingState(AppModeStateContext);

export const useGraphicalRecordingState =
  makeUseGraphicalRecordingState(AppModeStateContext);

export const useResultDisplayState =
  makeUseResultDisplayState(AppModeStateContext);

export const useCurrentAppMode = () => useContext(AppModeStateContext)[0].mode;
