import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode, ArbiterRecordingMode } from '../../types/AppModeState';
import { getStoredPairingList } from '../../util/storage';

type ArbiterRecordingStateHookType = [
  ArbiterRecordingMode,
  {
    goToRecordingMode: () => void;
    goBackToEnterPgn: () => void;
    goBackToPairingSelection: () => void;
    goBackToTablePairing: () => void;
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

    const goBackToEnterPgn = () => {
      setAppModeState({
        mode: AppMode.EnterPgn,
      });
    };

    const goBackToTablePairing = () => {
      setAppModeState({
        mode: AppMode.TablePairing,
        pairing: appModeState.pairing,
      });
    };

    const goBackToPairingSelection = async () => {
      setAppModeState({
        mode: AppMode.PairingSelection,
        pairings: (await getStoredPairingList()) ?? [],
      });
    };

    return [
      appModeState,
      {
        goToRecordingMode,
        goBackToEnterPgn,
        goBackToTablePairing,
        goBackToPairingSelection,
      },
    ];
  };
