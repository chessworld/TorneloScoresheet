import axios, { AxiosResponse } from 'axios';
import React, { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { useArbiterInfo } from '../../context/ArbiterInfoContext';
import { AppModeState, AppMode, EnterPgnMode } from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { isError, Result, succ, Success, fail } from '../../types/Result';
import { storePairingList } from '../../util/storage';
import { validUrl } from '../../util/url';

/**
 * Generates a State Transition Function
 * From EnterPgn -> PairingSelection
 * This transition involves fetching a PGN from a Tornello URL
 */
export const makegoToTablePairingSelection =
  (
    setAppMode: React.Dispatch<React.SetStateAction<AppModeState>>,
    pgnUrl: string,
  ): (() => Promise<Result<undefined>>) =>
  async () => {
    if (!validUrl(pgnUrl)) {
      return fail(
        'Invalid URL, please provide a valid Live Broadcast PGN link from the Tornelo website',
      );
    }
    // fetch pgn from api
    const resultOrErr: Result<AxiosResponse> = await (async () => {
      try {
        return succ(await axios.get(pgnUrl, { validateStatus: () => true }));
      } catch (e) {
        return fail('Network error, please check your internet connection');
      }
    })();

    if (isError(resultOrErr)) {
      return resultOrErr;
    }

    const result = resultOrErr.data;

    if (result.status !== 200 || typeof result.data !== 'string') {
      return fail('Error downloading PGN. Please double check the link');
    }

    // split into multiple pgn per pairing
    const pairingPgns = splitRoundIntoMultiplePgn(result.data);

    if (!pairingPgns.length) {
      return fail(
        'Invalid PGN returned from website. Please double check the link',
      );
    }

    const pairingOrFailures = pairingPgns.map(chessEngine.parseGameInfo);

    const firstError = pairingOrFailures.find(isError);

    if (firstError) {
      return firstError;
    }

    //Filter out errors and finished games
    const pairings = pairingOrFailures
      .filter(
        (p: Result<ChessGameInfo>): p is Success<ChessGameInfo> => !isError(p),
      )
      .filter((p: Success<ChessGameInfo>) => p.data.result === '*')
      .map(({ data }) => data);

    // Save the pairings to local storage
    storePairingList(pairings);

    setAppMode({
      mode: AppMode.PairingSelection,
      games: pairings.length,
      pairings,
    });

    return succ(undefined);
  };

const splitRoundIntoMultiplePgn = (roundPgns: string): string[] => {
  let rounds = roundPgns.split(/\n{3}/g);

  // check if last element is not empty string
  if (!rounds.length) {
    return [];
  }
  if (rounds[rounds.length - 1] === '') {
    rounds.splice(rounds.length - 1);
  }

  return rounds;
};

/**
 * Enter Pgn state hook
 */
type EnterPgnStateHookType = {
  state: EnterPgnMode;
  goToPairingSelection: () => Promise<Result<undefined>>;
  viewPastGames: () => void;
};

export const makeUseEnterPgnState =
  (context: AppModeStateContextType): (() => EnterPgnStateHookType | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);
    const [arbiterInfo] = useArbiterInfo();
    if (appModeState.mode !== AppMode.EnterPgn) {
      return null;
    }
    const viewPastGames = () =>
      setAppModeState(previous => {
        if (previous.mode !== AppMode.EnterPgn) {
          return previous;
        }
        return { mode: AppMode.ViewPastGames };
      });

    const goToPairingSelection = makegoToTablePairingSelection(
      setAppModeState,
      arbiterInfo?.broadcastUrl ?? '',
    );

    return {
      goToPairingSelection,
      viewPastGames,
      state: appModeState,
    };
  };
