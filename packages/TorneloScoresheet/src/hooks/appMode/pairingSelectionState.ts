import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
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
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => PairingSelectionStateHookType | null) =>
  (): PairingSelectionStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.PariringSelection) {
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

    return [
      appModeState,
      {
        goToEnterPgn,
        goToTablePairing,
      },
    ];
  };
