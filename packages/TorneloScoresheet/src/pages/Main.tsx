import React from 'react';
import PrimaryText from '../components/PrimaryText/PrimaryText';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import EnterPgn from './EnterPgn/EnterPgn';
import PairingSelection from './PairingSelection/PairingSelection';

const Main: React.FC = () => {
  const appMode = useAppModeState();

  switch (appMode.mode) {
    case AppMode.EnterPgn:
      return <EnterPgn />;
    case AppMode.PariringSelection:
      return <PairingSelection />;
    default:
      return <PrimaryText label="Unsupported app mode" />;
  }
};

export default Main;
