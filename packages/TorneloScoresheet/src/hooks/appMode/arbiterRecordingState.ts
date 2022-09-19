import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode, ArbiterRecordingMode } from '../../types/AppModeState';

type ArbiterRecordingStateHookType = [
  ArbiterRecordingMode,
  {
    goToRecordingMode: () => void;
  },
];

export const makeUseArbiterRecordingState =
  (
    context: AppModeStateContextType,
  ): (() => ArbiterRecordingStateHookType | null) =>
  (): ArbiterRecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterRecording) {
      return null;
    }

    const goToRecordingMode = (): void => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.Recording,
      });
    };

    return [appModeState, { goToRecordingMode }];
  };
