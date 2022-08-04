import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ArbiterGraphicalRecordingMode,
} from '../../types/AppModeState';

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
      setAppModeState({ ...appModeState, mode: AppMode.GraphicalRecording });
    };

    return [appModeState, { goToRecordingMode }];
  };
