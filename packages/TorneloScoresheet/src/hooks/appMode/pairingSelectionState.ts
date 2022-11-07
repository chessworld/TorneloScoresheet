import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { useArbiterInfo } from '../../context/ArbiterInfoContext';
import { AppMode, PairingSelectionMode } from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { Result } from '../../types/Result';
import { makegoToTablePairingSelection } from './enterPgnState';

type PairingSelectionStateHookType = [
  PairingSelectionMode,
  {
    goToEnterPgn: () => void;
    goToGameHistory: () => void;
    goToTablePairing: (pairing: ChessGameInfo) => void;
    refreshPairings: () => Promise<Result<undefined>>;
  },
];

export const makeUsePairingSelectionState =
  (
    context: AppModeStateContextType,
  ): (() => PairingSelectionStateHookType | null) =>
  (): PairingSelectionStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    const [arbiterInfo] = useArbiterInfo();

    if (appModeState.mode !== AppMode.PairingSelection) {
      return null;
    }

    const goToEnterPgn = (): void => {
      setAppModeState({
        mode: AppMode.EnterPgn,
      });
    };

    const refreshPairings = makegoToTablePairingSelection(
      setAppModeState,
      arbiterInfo?.broadcastUrl ?? '',
    );

    const goToTablePairing = (pairing: ChessGameInfo): void => {
      setAppModeState({
        mode: AppMode.ArbiterTablePairing,
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
        refreshPairings,
      },
    ];
  };
