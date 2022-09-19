import { useContext, useEffect, useMemo, useState } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode } from '../../types/AppModeState';
import { getStoredGameHistory, StoredGameHistory } from '../../util/storage';

type ViewPastGamesViewModel = {
  goToEnterPgn: () => void;
  pastGames: StoredGameHistory[];
  selectedGame: StoredGameHistory | undefined;
  selectGame: (index: number) => void;
  deselectGame: () => void;
};

export const makeUseViewPastGames =
  (context: AppModeStateContextType): (() => ViewPastGamesViewModel | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);
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

    const selectGame = (index: number) => setSelectedGameIndex(index);

    const deselectGame = () => setSelectedGameIndex(undefined);

    if (appModeState.mode !== AppMode.ViewPastGames) {
      return null;
    }

    return {
      goToEnterPgn,
      pastGames,
      selectedGame,
      selectGame,
      deselectGame,
    };
  };
