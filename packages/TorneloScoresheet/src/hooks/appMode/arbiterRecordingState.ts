import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ArbiterRecordingMode as ArbiterRecordingMode,
} from '../../types/AppModeState';

type arbiterRecordingStateHookType = [
  ArbiterRecordingMode,
  {
    goToRecordingMode: () => void;
  },
];

export const makeUseArbiterRecordingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => arbiterRecordingStateHookType | null) =>
  (): arbiterRecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterRecording) {
      return null;
    }

    const goToRecordingMode = (): void => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.Recording,
        type: 'Graphical',
        startTime: new Date().getTime(),
      });
    };

    return [appModeState, { goToRecordingMode }];
  };
