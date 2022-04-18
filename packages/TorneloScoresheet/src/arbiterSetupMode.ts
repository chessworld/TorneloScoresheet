import axios from 'axios';
import { parseGameInfo } from './chessEngine';
import { AppMode, AppModeState } from './types/AppModeState';
import { GameInfo } from './types/chessGameInfo';
import { Result } from './types/Result';

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
      const roundPgn = result.data;

      // split into multiple pgn per pairing
      const paringPgns = splitRoundIntoMultiplePgn(roundPgn)

      let pairings: GameInfo[] = []

      // extract gameinfo from each pgn 
      if (paringPgns != undefined) {

        paringPgns.forEach(pgn => {
          // parse pgn as gameinfo
          let gameInfo = parseGameInfo(pgn)

          // add to array if no error
          if (gameInfo != undefined) {
            pairings.push(gameInfo)
          }
        })
      }

      // TODO
      // 3. Set new game state
      setAppMode({ mode: AppMode.TablePairing, games: 0, pairings: pairings });
      return '';
    };


const splitRoundIntoMultiplePgn = (roundPgns: string): string[] | undefined => {
  try {

    let rounds = roundPgns.split(/\n{3}/g)

    // if more than 1 pairing, last element will be empty string -> remove
    if (rounds.length > 2) {
      rounds.splice(rounds.length - 2)
    }
    return rounds


  } catch {
    // error occured -> return undefined
    return undefined
  }
}