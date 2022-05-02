import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  TablePairingMode,
} from '../../types/AppModeState';


type TablePairingStateHookType = [
    TablePairingMode,
    // TO DO: PASS IN ARGUMENTS
          
  ];
  
  export const makeUseEnterTablePairingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => TablePairingStateHookType | null) =>
  () => {
    const [appModeState] = useContext(context);
    if (appModeState.mode !== AppMode.TablePairing) {
      return null;
    }
   
    return [appModeState,];
  };
