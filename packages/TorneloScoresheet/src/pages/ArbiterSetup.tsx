import React from 'react';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode, ArbiterModeViews } from '../types/AppModeState';
import EnterPgnLink from './EnterPgnLink';
import TablePairingSelection from './TablePairingSelection';

const ArbiterSetup: React.FC = () => {
  const [appModeState] = useAppModeState();
  if (appModeState.mode != AppMode.ArbiterSetup) {
    return <></>;
  }
  switch (appModeState.view) {
    case ArbiterModeViews.EnterPgnLink:
      return <EnterPgnLink />;
    //test
    case ArbiterModeViews.TablePairingSelection:
      return <TablePairingSelection />;
  }
};

export default ArbiterSetup;
