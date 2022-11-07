import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode, PairingSelectionMode } from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';

type PairingSelectionStateHookType = [
  PairingSelectionMode,
  {
    goToEnterPgn: () => void;
    goToGameHistory: () => void;
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
      });
    };

    const goToTablePairing = (pairing: ChessGameInfo): void => {
      setAppModeState({
        mode: AppMode.TablePairing,
        pairing: pairing,
      });
    };
    const goToGameHistory = () => {
      setAppModeState({
        mode: AppMode.ViewPastGames,
      });
    };
    return [
      appModeState,
      {
        goToEnterPgn,
        goToTablePairing,
        goToGameHistory,
      },
    ];
  };
