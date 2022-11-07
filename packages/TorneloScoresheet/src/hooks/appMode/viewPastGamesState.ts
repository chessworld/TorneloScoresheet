import { useContext, useEffect, useMemo, useState } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { useArbiterInfo } from '../../context/ArbiterInfoContext';
import { AppMode } from '../../types/AppModeState';
import { Result } from '../../types/Result';
import { getStoredGameHistory, StoredGameHistory } from '../../util/storage';
import { makegoToTablePairingSelection } from './enterPgnState';

type ViewPastGamesViewModel = {
  goToEnterPgn: () => void;
  pastGames: StoredGameHistory[];
  selectedGame: StoredGameHistory | undefined;
  goToPairingSelection: () => Promise<Result<undefined>>;
  selectGame: (index: number) => void;
  deselectGame: () => void;
};

export const makeUseViewPastGames =
  (context: AppModeStateContextType): (() => ViewPastGamesViewModel | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);
    const [arbiterInfo] = useArbiterInfo();

    const [pastGames, setPastGames] = useState<StoredGameHistory[]>([]);
    const [selectedGameIndex, setSelectedGameIndex] = useState<
      number | undefined
    >(undefined);

    const selectedGame = useMemo(() => {
      if (selectedGameIndex === undefined) {
        return undefined;
      }
      return pastGames[selectedGameIndex];
    }, [pastGames, selectedGameIndex]);

    useEffect(() => {
      getStoredGameHistory().then(result => {
        if (!result) {
          return;
        }
        setPastGames(result);
      });
    }, []);

    const goToEnterPgn = () =>
      setAppModeState(previous => {
        if (previous.mode !== AppMode.ViewPastGames) {
          return previous;
        }
        return { mode: AppMode.EnterPgn };
      });

    const goToPairingSelection = makegoToTablePairingSelection(
      setAppModeState,
      arbiterInfo?.broadcastUrl ?? '',
    );
    const selectGame = (index: number) => setSelectedGameIndex(index);

    const deselectGame = () => setSelectedGameIndex(undefined);

    if (appModeState.mode !== AppMode.ViewPastGames) {
      return null;
    }

    return {
      goToEnterPgn,
      goToPairingSelection,
      pastGames,
      selectedGame,
      selectGame,
      deselectGame,
    };
  };
