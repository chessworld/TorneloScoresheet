import axios from 'axios';
import { parseGameInfo } from './chessEngine';
import { AppMode, AppModeState } from './types/AppModeState';
import { GameInfo } from './types/chessGameInfo';
import { Result } from './types/Result';
import { validUrl } from './util/url';

/**
 * Given a state setter, return a function for transitioning from
 * arbiter setup mode to table pairing mode.
 *
 * This transition involves fetching a PGN from a Tornello URL
 */
export const makeEnterTablePairingMode =
  (
    setAppMode: React.Dispatch<React.SetStateAction<AppModeState>>,
  ): ((liveLinkUrl: string) => Promise<Result>) =>
  async (liveLinkUrl: string) => {
    if (!validUrl(liveLinkUrl)) {
      // TODO: Return a proper error
      return '';
    }
    // fetch pgn from api
    const result = await axios.get(liveLinkUrl, { validateStatus: () => true });

    if (result.status !== 200) {
      // TODO: Return a proper error
      return '';
    }
    if (typeof result.data !== 'string') {
      // TODO: Return a proper error
      return '';
    }

    // split into multiple pgn per pairing
    const pairingPgns = splitRoundIntoMultiplePgn(result.data);

    // TODO: handle undefined gameinfo returned from parseGameInfo instead of filtering them out
    const pairings = pairingPgns
      .map(parseGameInfo)
      .filter((pgn): pgn is GameInfo => !!pgn);

    setAppMode({
      mode: AppMode.TablePairing,
      games: pairings.length,
      pairings: pairings,
    });

    return '';
  };

const splitRoundIntoMultiplePgn = (roundPgns: string): string[] => {
  let rounds = roundPgns.split(/\n{3}/g);

  // check if last element is not empty string
  if (rounds[rounds.length - 1] === '') {
    rounds.splice(rounds.length - 1);
  }

  return rounds;
};
