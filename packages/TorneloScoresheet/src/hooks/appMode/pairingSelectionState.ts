import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import {
  AppMode,
  EnterPgnViews,
  PairingSelectionMode,
} from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';

type PairingSelectionStateHookType = [
  PairingSelectionMode,
  {
    goToEnterPgn: () => void;
    goToTablePairing: (pairing: ChessGameInfo) => void;
  },
];

export const makeUsePairingSelectionState =
  (
    context: AppModeStateContextType,
  ): (() => PairingSelectionStateHookType | null) =>
  (): PairingSelectionStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.PairingSelection) {
      return null;
    }

    const goToEnterPgn = (): void => {
      setAppModeState({
        mode: AppMode.EnterPgn,
        view: EnterPgnViews.ENTER_PGN,
      });
    };

    const goToTablePairing = (pairing: ChessGameInfo): void => {
      setAppModeState({
        mode: AppMode.TablePairing,
        pairing: pairing,
      });
    };

    return [
      appModeState,
      {
        goToEnterPgn,
        goToTablePairing,
      },
    ];
  };
