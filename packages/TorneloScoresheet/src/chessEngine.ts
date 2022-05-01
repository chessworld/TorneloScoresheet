import { Chess } from 'chess.ts';
import moment from 'moment';
import {
  ChessGameInfo,
  Player,
  PlayerColour,
  PLAYER_COLOUR_NAME,
} from './types/ChessGameInfo';
import { Result, succ, fail, isError } from './types/Result';

const PARSING_FAILURE = fail(
  'Invalid PGN returned from website. Please double check the link',
);

/**
 * Extracts game info from a pgn string (using headers) will return undefined if error occurs when parsing.
 * @param pgn pgn string of the game to be parsed
 * @returns All info of game from headers
 */
export const parseGameInfo = (pgn: string): Result<ChessGameInfo> => {
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
    const [board, round, gameNo] = rounds.data;

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
      round: round,
      board: board,
      game: gameNo,
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

/**
 * @param round round text
 * @returns <board, round, game>
 */
export const parseRoundInfo = (
  round: string,
): Result<[number, number?, number?]> => {
  const ROUND_FAILURE = fail('Error parsing PGN round');
  // parse round and subround
  const roundRegex = /(?<one>[0-9]+)[.]?(?<two>[0-9]*)[.]?(?<three>[0-9]*)/;
  let regexResults = roundRegex.exec(round);
  if (regexResults === null || !regexResults.groups) {
    return ROUND_FAILURE;
  }

  // get
  let one = parseInt(regexResults.groups.one, 10);
  let two = parseInt(regexResults.groups.two, 10);
  let three = parseInt(regexResults.groups.three, 10);

  // format: ''.0.1 -> failure
  if (isNaN(one)) {
    return ROUND_FAILURE;
  }

  // format: 1 -> board: 1, round: undef, game: undef
  if (isNaN(two) && isNaN(three)) {
    return succ([one]);
  }

  // format: 1.2 -> board: 2, round: 1, game: undef
  if (isNaN(three)) {
    return succ([two, one]);
  }

  // format: 1.2.3 -> board: 3, round: 1, game: 2
  return succ([three, one, two]);
};
