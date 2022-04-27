import axios from 'axios';
import { parseGameInfo } from './chessEngine';
import { AppMode, AppModeState, ArbiterModeViews } from './types/AppModeState';
import { GameInfo } from './types/chessGameInfo';
import { isError, Result, succ, Success, fail } from './types/Result';
import { validUrl } from './util/url';

/**
 * Given a state setter, return a function for transitioning from
 * Pgn enter view to parining selection view of arbiter setup mode
 *
 * This transition involves fetching a PGN from a Tornello URL
 */
export const makegoToTablePairingSelection =
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
    const result = await axios.get(liveLinkUrl, { validateStatus: () => true });

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

    const pairingOrFailures = pairingPgns.map(parseGameInfo);

    const firstError = pairingOrFailures.find(isError);

    if (firstError) {
      return firstError;
    }

    const pairings = pairingOrFailures
      .filter((p: Result<GameInfo>): p is Success<GameInfo> => !isError(p))
      .map(({ data }) => data);


    setAppMode({
      mode: AppMode.ArbiterSetup,
      view: ArbiterModeViews.TablePairingSelection,
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
