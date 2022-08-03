import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ArbiterGraphicalRecordingMode,
} from '../../types/AppModeState';
import { chessEngine } from '../../chessEngine/chessEngineInterface';

type arbiterGraphicalRecordingStateHookType = [
  ArbiterGraphicalRecordingMode,
  {
    goToRecordingMode: () => void;
  },
];

export const makeUseArbiterGraphicalRecordingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => arbiterGraphicalRecordingStateHookType | null) =>
  (): arbiterGraphicalRecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterGraphicalRecording) {
      return null;
    }

    const goToRecordingMode = (): void => {
      const board = chessEngine.fenToBoardPositions(chessEngine.startingFen());
      setAppModeState({
        mode: AppMode.GraphicalRecording,
        pairing: appModeState.pairing,
        moveHistory: [],
        board,
        currentPlayer: appModeState.currentPlayer,
      });
    };

    return [appModeState, { goToRecordingMode }];
  };
