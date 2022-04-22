import moment from 'moment';
import { parseGameInfo } from '../src/chessEngine';
import { isError, succ } from '../src/types/Result';

const pgnSuccess = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`;

test('chessEngineParsePgnSuccess', () => {
  let gameInfo = parseGameInfo(pgnSuccess);
  expect(gameInfo).toEqual(
    succ({
      name: 'Skywalker Challenge - A',
      site: 'Prague, Czechia',
      round: 6,
      subRound: 1,
      result: '*',
      date: moment('2021.09.12', 'YYYY.MM.DD'),
      pgn: pgnSuccess,
      players: [
        {
          color: 0,
          firstName: ' Anakin',
          lastName: 'Skywalker',
          elo: 0,
          country: '',
          fideId: 600000,
        },
        {
          color: 1,
          firstName: ' Master',
          lastName: 'Yoda',
          elo: 0,
          country: '',
          fideId: 1000000,
        },
      ],
    }),
  );
});

const pgnFailure = '';
test('chessEngineParsePgnFailure', () => {
  let gameInfo = parseGameInfo(pgnFailure);
  expect(isError(gameInfo)).toEqual(true);
});

const pgnNoFIdeId = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]

*
`;
test('chessEngineParsePgnNoFideId', () => {
  let gameInfo = parseGameInfo(pgnNoFIdeId);
  expect(gameInfo).toEqual(
    succ({
      name: 'Skywalker Challenge - A',
      site: 'Prague, Czechia',
      round: 6,
      subRound: 1,
      result: '*',
      date: moment('2021.09.12', 'YYYY.MM.DD'),
      pgn: pgnNoFIdeId,
      players: [
        {
          color: 0,
          firstName: ' Anakin',
          lastName: 'Skywalker',
          elo: 0,
          country: '',
          fideId: undefined,
        },
        {
          color: 1,
          firstName: ' Master',
          lastName: 'Yoda',
          elo: 0,
          country: '',
          fideId: undefined,
        },
      ],
    }),
  );
});
const pgnNoFirstName = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, ?"]
[Black "Yoda, ?"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`;

test('chessEngineParsePgnNoFirstName', () => {
  let gameInfo = parseGameInfo(pgnNoFirstName);
  expect(gameInfo).toEqual(
    succ({
      name: 'Skywalker Challenge - A',
      site: 'Prague, Czechia',
      round: 6,
      subRound: 1,
      result: '*',
      date: moment('2021.09.12', 'YYYY.MM.DD'),
      pgn: pgnNoFirstName,
      players: [
        {
          color: 0,
          firstName: ' ?',
          lastName: 'Skywalker',
          elo: 0,
          country: '',
          fideId: 600000,
        },
        {
          color: 1,
          firstName: ' ?',
          lastName: 'Yoda',
          elo: 0,
          country: '',
          fideId: 1000000,
        },
      ],
    }),
  );
});

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
</body>
<footer>
</footer>
</html>`;

test('chessEngineParseHtml', () => {
  let gameInfo = parseGameInfo(htmlString);
  expect(isError(gameInfo)).toEqual(true);
});
