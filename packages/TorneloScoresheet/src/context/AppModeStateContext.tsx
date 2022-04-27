import React, { useContext, useState } from 'react';
import { makegoToTablePairingSelection as makeGoToTablePairingSelection } from '../goToTablePairingSelection';
import { AppModeState, AppMode, ArbiterModeViews } from '../types/AppModeState';
import { GameInfo } from '../types/chessGameInfo';
import { Result } from '../types/Result';

// The global state for the app
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([
  { mode: AppMode.ArbiterSetup, view: ArbiterModeViews.EnterPgnLink },
  () => undefined,
]);

type AppModeStateHookType = [
  AppModeState,
  {
    goToTablePairingSelection: (
      liveLinkUrl: string,
    ) => Promise<Result<undefined>>;
    goToTablePairingMode: (pairing: GameInfo) => void;
    goToEnterPgnLink: () => void;
  },
];

export const useAppModeState = (): AppModeStateHookType => {
  const [appModeState, setAppModeState] = useContext(AppModeStateContext);

  const goToTablePairingSelection =
    makeGoToTablePairingSelection(setAppModeState);
  const goToEnterPgnLink = () => {
    setAppModeState({
      mode: AppMode.ArbiterSetup,
      view: ArbiterModeViews.EnterPgnLink,
    });
  };
  const goToTablePairingMode = (pairing: GameInfo) => {};
  return [
    appModeState,
    {
      goToTablePairingSelection: goToTablePairingSelection,
      goToEnterPgnLink: goToEnterPgnLink,
      goToTablePairingMode: goToTablePairingMode,
    },
  ];
};

export const AppModeStateContextProvider: React.FC = ({ children }) => {
  const appModeState = useState({
    mode: AppMode.ArbiterSetup,
    view: ArbiterModeViews.EnterPgnLink,
  } as AppModeState);

  return (
    <AppModeStateContext.Provider value={appModeState}>
      {children}
    </AppModeStateContext.Provider>
  );
};
