import React, { useContext, useState } from 'react';
import { makegoToTablePairingSelection as makeEnterPgnToPairingSelection } from '../goToTablePairingSelection';
import { AppModeState, AppMode } from '../types/AppModeState';
import { GameInfo } from '../types/chessGameInfo';
import { Result } from '../types/Result';

// The global state for the app
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([{ mode: AppMode.EnterPgn }, () => undefined]);

type AppModeStateHookType = [
  AppModeState,
  {
    enterPgnToPairingSelection: (
      liveLinkUrl: string,
    ) => Promise<Result<undefined>>;
    pairingSelectionToTablePairing: (pairing: GameInfo) => void;
    pairingSelectionToEnterPgn: () => void;
  },
];

export const useAppModeState = (): AppModeStateHookType => {
  const [appModeState, setAppModeState] = useContext(AppModeStateContext);

  // state transition functions
  const pairingSelectionToTablePairingFunc = (pairing: GameInfo) => {};

  const pairingSelectionToEnterPgnFunc = () => {
    setAppModeState({
      mode: AppMode.EnterPgn,
    });
  };

  const enterPgnToPairingSelectionFunc =
    makeEnterPgnToPairingSelection(setAppModeState);

  return [
    appModeState,
    {
      enterPgnToPairingSelection: enterPgnToPairingSelectionFunc,
      pairingSelectionToEnterPgn: pairingSelectionToEnterPgnFunc,
      pairingSelectionToTablePairing: pairingSelectionToTablePairingFunc,
    },
  ];
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
