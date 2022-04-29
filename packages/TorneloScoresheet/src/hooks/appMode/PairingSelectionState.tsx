import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  PairingSelectionMode,
} from '../../types/AppModeState';
import { GameInfo } from '../../types/chessGameInfo';

type PairingSelectionStateHookType = [
  PairingSelectionMode,
  {
    goToEnterPgn: () => void;
    goToTablePairing: (pairing: GameInfo) => void;
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

    const goToEnterPgnFunc = (): void => {
      setAppModeState({
        mode: AppMode.EnterPgn,
      });
    };

    const goToTablePairingFunc = (pairing: GameInfo): void => {
      setAppModeState({
        mode: AppMode.TablePairing,
        pairing: pairing,
      });
    };

    return [
      appModeState,
      {
        goToEnterPgn: goToEnterPgnFunc,
        goToTablePairing: goToTablePairingFunc,
      },
    ];
  };
