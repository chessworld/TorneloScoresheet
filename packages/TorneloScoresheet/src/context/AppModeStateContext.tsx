import React, { useContext, useState } from 'react';
import { makeUseEnterPgnState } from '../hooks/appMode/enterPgnState';
import { makeUsePairingSelectionState } from '../hooks/appMode/pairingSelectionState';
import { makeUseTablePairingState } from '../hooks/appMode/tablePairingState';
import { makeUseRecordingState } from '../hooks/appMode/recordingState';
import { AppModeState, AppMode } from '../types/AppModeState';
import { makeUseResultDisplayState } from '../hooks/appMode/resultDisplayState';
import { makeUseArbiterRecordingState } from '../hooks/appMode/arbiterRecordingState';
import { makeUseArbiterTablePairingState } from '../hooks/appMode/arbiterTablePairingState';
import { makeUseArbiterResultDisplayState } from '../hooks/appMode/arbiterResultDisplayState';
import { makeUseEditMoveState } from '../hooks/appMode/editMoveState';
import { makeUseViewPastGames } from '../hooks/appMode/viewPastGamesState';
import { makeToolbarViewModel } from '../hooks/appMode/toolbarViewModel';

export type AppModeStateContextType = React.Context<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>;

// The global state for the app
// This is not exported so the setAppModeState is never leaked
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([{ mode: AppMode.EnterPgn }, () => undefined]);

export const useAppModeState = (): AppModeState => {
  const [appModeState] = useContext(AppModeStateContext);

  return appModeState;
};

export const AppModeStateContextProvider: React.FC<{
  initialState: AppModeState;
}> = ({ children, initialState }) => {
  const appModeState = useState(initialState);

  return (
    <AppModeStateContext.Provider value={appModeState}>
      {children}
    </AppModeStateContext.Provider>
  );
};

// state creations
export const useToolbar = makeToolbarViewModel(AppModeStateContext);

export const useEnterPgnState = makeUseEnterPgnState(AppModeStateContext);

export const useViewPastGames = makeUseViewPastGames(AppModeStateContext);

export const usePairingSelectionState =
  makeUsePairingSelectionState(AppModeStateContext);

export const useTablePairingState =
  makeUseTablePairingState(AppModeStateContext);

export const useRecordingState = makeUseRecordingState(AppModeStateContext);

export const useEditMove = makeUseEditMoveState(AppModeStateContext);

export const useResultDisplayState =
  makeUseResultDisplayState(AppModeStateContext);

export const useArbiterRecordingState =
  makeUseArbiterRecordingState(AppModeStateContext);

export const useArbiterTablePairingState =
  makeUseArbiterTablePairingState(AppModeStateContext);

export const useArbiterResultDisplayState =
  makeUseArbiterResultDisplayState(AppModeStateContext);

export const useCurrentAppMode = () => useContext(AppModeStateContext)[0].mode;
