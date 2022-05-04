import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  TablePairingMode,
} from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';

type TablePairingStateHookType = [
  TablePairingMode,
  { goToRecording: (pairing: ChessGameInfo, playerNumber: number) => void },
];

export const makeUseEnterTablePairingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => TablePairingStateHookType | null) =>
  (): TablePairingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.TablePairing) {
      return null;
    }

    const goToRecordingFunc = (
      pairing: ChessGameInfo,
      playerNumber: number,
    ): void => {
      setAppModeState({
        mode: AppMode.PlayerScoresheetRecording,
        pairing: pairing,
        playerNumber: playerNumber,
      });
    };

    return [appModeState, { goToRecording: goToRecordingFunc }];
  };
