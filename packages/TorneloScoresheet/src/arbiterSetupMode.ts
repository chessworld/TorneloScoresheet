import axios from 'axios';
import { AppMode, AppModeState } from './types/AppModeState';
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
    const result = await axios.get(liveLinkUrl, { validateStatus: () => true });

    if (result.status !== 200) {
      // TODO: Return a proper error
      return '';
    }
    if (typeof result.data !== 'string') {
      // TODO: Return a proper error
      return '';
    }

    const pgn = result.data;

    console.log(pgn);

    // TODO
    // 2. Parse PGN
    // 3. Set new game state
    setAppMode({ mode: AppMode.TablePairing, games: 0 });
    return '';
  };
