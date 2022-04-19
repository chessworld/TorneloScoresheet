import { Chess } from 'chess.ts';
import moment from 'moment';
import {
  GameInfo,
  Player,
  PlayerColour,
  PLAYER_COLOUR_NAME,
} from './types/chessGameInfo';

/**
 * Extracts game info from a pgn string (using headers) will return undefined if error occurs when parsing.
 * @param pgn pgn string of the game to be parsed
 * @returns All info of game from headers
 */
export const parseGameInfo = (pgn: string): GameInfo | undefined => {
  // create game object to parse pgn
  let game = new Chess();

  try {
    // parse pgn
    if (!game.loadPgn(pgn)) {
      // TODO: return proper error, game failed to parse pgn
      return undefined;
    }

    // extract rounds
    const rounds = parseRoundInfo(game.header().Round);
    if (rounds === undefined) {
      // TODO: return proper error
      return undefined;
    }
    const [mainRound, subRound] = rounds;

    // extract player
    const whitePlayer = extractPlayer(PlayerColour.White, game.header());
    const blackPlayer = extractPlayer(PlayerColour.Black, game.header());
    if (whitePlayer === undefined || blackPlayer === undefined) {
      // TODO: return proper error
      return undefined;
    }

    return {
      name: game.header().Event ?? '',
      date: moment(game.header().Date ?? '', 'YYYY.MM.DD'),
      site: game.header().Site ?? '',
      round: mainRound,
      subRound: subRound,
      result: game.header().Result ?? '',
      players: [whitePlayer, blackPlayer],
      pgn: pgn,
    };
  } catch (error) {
    // TODO: return proper error, message from error object
    return undefined;
  }
};

// ------- Privates

const extractPlayer = (
  color: PlayerColour,
  headers: Record<string, string>,
): Player | undefined => {
  let playerColorName = PLAYER_COLOUR_NAME[color];

  // get player names
  const names = parsePlayerName(headers[playerColorName] ?? '');
  if (names === undefined) {
    // TODO: return proper error
    return undefined;
  }
  const [firstName, lastName] = names;

  // get player fide id
  let fideId = parseInt(headers[`${playerColorName}FideId`] ?? '', 10);
  if (isNaN(fideId)) {
    // TODO: return proper error
    return undefined;
  }

  return {
    firstName: firstName,
    lastName: lastName,
    color: color,
    fideId: fideId,
    elo: 0,
    country: '',
  };
};

const parsePlayerName = (name: string): [string, string] | undefined => {
  // parse first and last names
  let nameRegexResult = name.match(/(.+)[,]{1}(.+)/);

  if (nameRegexResult === null) {
    // TODO: return proper error format incorrect
    return undefined;
  }
  if (nameRegexResult.length !== 3) {
    // TODO: return proper error format incorrect
    return undefined;
  }

  // return firstname, lastname
  return [nameRegexResult[2], nameRegexResult[1]];
};

const parseRoundInfo = (round: string): [number, number] | undefined => {
  // parse round and subround
  let regexResults = round.match(/([0-9]+)[.]?([0-9]*)/);

  if (regexResults === null) {
    // TODO: return proper error (round doesnt mathc expected format)
    return undefined;
  }
  if (regexResults.length !== 3) {
    // TODO: return proper error (round matches format but main round and subround were not found)
    return undefined;
  }

  // return main round and sub round tuple
  let mainRound = parseInt(regexResults[1], 10);
  let subRound = parseInt(regexResults[2], 10);

  if (isNaN(mainRound) || isNaN(subRound)) {
    // TODO: return proper error (round and subround are not numbers)
    return undefined;
  }

  return [mainRound, subRound];
};
