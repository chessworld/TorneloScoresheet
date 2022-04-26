import React, { useContext, useState } from 'react';
import { makeEnterTablePairingMode } from '../arbiterSetupMode';
import { AppModeState, AppMode } from '../types/AppModeState';
import { Result } from '../types/Result';

// The global state for the app
const AppModeStateContext = React.createContext<
  [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
>([{ mode: AppMode.ArbiterSetup }, () => undefined]);

type AppModeStateHookType = [
  AppModeState,
  {
    enterTablePairingMode: (liveLinkUrl: string) => Promise<Result<undefined>>;
    returnToPgnLinkPage: () => void;
  },
];

export const useAppModeState = (): AppModeStateHookType => {
  const [appModeState, setAppModeState] = useContext(AppModeStateContext);

  const enterTablePairingMode = makeEnterTablePairingMode(setAppModeState);
  const returnToPgnLinkPage = () => {
    setAppModeState({
      mode: AppMode.ArbiterSetup
    });
  }
  return [appModeState, { enterTablePairingMode, returnToPgnLinkPage }];
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
