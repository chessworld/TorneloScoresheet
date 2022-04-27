import { Chess } from 'chess.ts';
import moment from 'moment';
import {
  GameInfo,
  Player,
  PlayerColour,
  PLAYER_COLOUR_NAME,
} from './types/chessGameInfo';
import { Result, succ, fail, isError } from './types/Result';

const PARSING_FAILURE = fail(
  'Invalid PGN returned from website. Please double check the link',
);

/**
 * Extracts game info from a pgn string (using headers) will return undefined if error occurs when parsing.
 * @param pgn pgn string of the game to be parsed
 * @returns All info of game from headers
 */
export const parseGameInfo = (pgn: string): Result<GameInfo> => {
  // create game object to parse pgn
  let game = new Chess();

  try {
    // parse pgn
    if (!game.loadPgn(pgn)) {
      return PARSING_FAILURE;
    }

    // extract rounds
    const rounds = parseRoundInfo(game.header().Round);
    if (isError(rounds)) {
      return rounds;
    }
    const [mainRound, subRound] = rounds.data;

    // extract players
    const whitePlayerOrError = extractPlayer(PlayerColour.White, game.header());
    if (isError(whitePlayerOrError)) {
      return whitePlayerOrError;
    }
    const whitePlayer = whitePlayerOrError.data;

    const blackPlayerOrError = extractPlayer(PlayerColour.Black, game.header());
    if (isError(blackPlayerOrError)) {
      return blackPlayerOrError;
    }
    const blackPlayer = blackPlayerOrError.data;

    return succ({
      name: game.header().Event ?? '',
      date: moment(game.header().Date ?? '', 'YYYY.MM.DD'),
      site: game.header().Site ?? '',
      round: mainRound,
      subRound: subRound,
      result: game.header().Result ?? '',
      players: [whitePlayer, blackPlayer],
      pgn: pgn,
    });
  } catch (error) {
    return PARSING_FAILURE;
  }
};

// ------- Privates

const extractPlayer = (
  color: PlayerColour,
  headers: Record<string, string>,
): Result<Player> => {
  let playerColorName = PLAYER_COLOUR_NAME[color];

  // get player names
  const names = parsePlayerName(headers[playerColorName] ?? '');
  if (isError(names)) {
    return names;
  }
  const [firstName, lastName] = names.data;

  // get player fide id
  const parsedFideId = parseInt(headers[`${playerColorName}FideId`] ?? '', 10);
  const fideId = isNaN(parsedFideId) ? undefined : parsedFideId;

  return succ({
    firstName,
    lastName,
    color,
    fideId,
    elo: 0,
    // TODO: When the tornelo server starts returning the country, return it
    country: '',
  });
};

const parsePlayerName = (name: string): Result<[string, string]> => {
  // parse first and last names
  let nameRegexResult = name.match(/(.+)[,]{1}(.+)/);

  if (nameRegexResult === null) {
    return fail("PGN game didn't have any names");
  }
  if (nameRegexResult.length !== 3) {
    return fail("PGN game didn't have any names");
  }

  // return firstname, lastname
  return succ([nameRegexResult[2], nameRegexResult[1]]);
};

const parseRoundInfo = (round: string): Result<[number, number]> => {
  const ROUND_FAILURE = fail("PGN Didn't have any round (please ensure the broadcast url is split by round)");
  // parse round and subround
  let regexResults = round.match(/([0-9]+)[.]?([0-9]*)/);

  if (regexResults === null) {
    return ROUND_FAILURE;
  }
  if (regexResults.length !== 3) {
    return ROUND_FAILURE;
  }

  // return main round and sub round tuple
  let mainRound = parseInt(regexResults[1], 10);
  let subRound = parseInt(regexResults[2], 10);

  if (isNaN(mainRound) || isNaN(subRound)) {
    return ROUND_FAILURE;
  }

  return succ([mainRound, subRound]);
};
