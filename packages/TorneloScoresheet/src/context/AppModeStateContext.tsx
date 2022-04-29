import React, { useContext, useState } from 'react';
import { AppModeState, AppMode } from '../types/AppModeState';

// The global state for the app
export const AppModeStateContext = React.createContext<
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
