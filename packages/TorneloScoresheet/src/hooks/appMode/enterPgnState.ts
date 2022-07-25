import axios, { AxiosResponse } from 'axios';
import React, { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppModeState, AppMode, EnterPgnMode } from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { isError, Result, succ, Success, fail } from '../../types/Result';
import { validUrl } from '../../util/url';

/**
 * Generates a State Transition Function
 * From EnterPgn -> PairingSelection
 * This transition involves fetching a PGN from a Tornello URL
 */
const makegoToTablePairingSelection =
  (
    setAppMode: React.Dispatch<React.SetStateAction<AppModeState>>,
  ): ((liveLinkUrl: string) => Promise<Result<undefined>>) =>
  async (liveLinkUrl: string) => {
    if (!validUrl(liveLinkUrl)) {
      return fail(
        'Invalid URL, please provide a valid Live Broadcast PGN link from the Tornelo website',
      );
    }
    // fetch pgn from api
    const resultOrErr: Result<AxiosResponse> = await (async () => {
      try {
        return succ(
          await axios.get(liveLinkUrl, { validateStatus: () => true }),
        );
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
type EnterPgnStateHookType = [
  EnterPgnMode,
  {
    goToPairingSelection: (liveLinkUrl: string) => Promise<Result<undefined>>;
  },
];
export const makeUseEnterPgnState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => EnterPgnStateHookType | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.EnterPgn) {
      return null;
    }

    const goToPairingSelection = makegoToTablePairingSelection(setAppModeState);

    return [appModeState, { goToPairingSelection }];
  };
