import moment from 'moment';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import { ChessBoardPositions } from '../src/types/ChessBoardPositions';
import { PlayerColour } from '../src/types/ChessGameInfo';
import { isError, succ } from '../src/types/Result';

// ---- chessEngine.parseGameInfo() ----
const pgnSucess = `[Event "Skywalker Challenge - A"]
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
const pgnNoFIdeId = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]

*
`;
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

const pgnOnlyBoard = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`;

const pgnBoardRoundGame = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1.3"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`;

describe('parseGameInfo', () => {
  const testCases = [
    {
      name: 'ParsePgnSuccess',
      pgn: pgnSucess,
      shouldFail: false,
      expectedResult: {
        name: 'Skywalker Challenge - A',
        site: 'Prague, Czechia',
        round: 6,
        board: 1,
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnSucess,
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
      },
    },
    {
      name: 'empty pgn',
      pgn: '',
      shouldFail: true,
    },
    {
      name: 'html instead of pgn',
      pgn: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      </head>
      <body>
      </body>
      <footer>
      </footer>
      </html>`,
      shouldFail: true,
    },
    {
      name: 'Pgn with no fideId',
      shouldFail: false,
      pgn: pgnNoFIdeId,
      expectedResult: {
        name: 'Skywalker Challenge - A',
        site: 'Prague, Czechia',
        round: 6,
        board: 1,
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
      },
    },
    {
      name: 'Pgn no first name',
      shouldFail: false,
      pgn: pgnNoFirstName,
      expectedResult: {
        name: 'Skywalker Challenge - A',
        site: 'Prague, Czechia',
        round: 6,
        board: 1,
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
      },
    },
    {
      name: 'pgn only board',
      shouldFail: false,
      pgn: pgnOnlyBoard,
      expectedResult: {
        name: 'Skywalker Challenge - A',
        site: 'Prague, Czechia',
        board: 6,
        round: undefined,
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnOnlyBoard,
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
      },
    },
    {
      name: 'Pgn board, round and game',
      shouldFail: false,
      pgn: pgnBoardRoundGame,
      expectedResult: {
        name: 'Skywalker Challenge - A',
        site: 'Prague, Czechia',
        board: 3,
        game: 1,
        round: 6,
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnBoardRoundGame,
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
      },
    },
  ];

  testCases.forEach(test => {
    it(test.name, () => {
      const result = chessEngine.parseGameInfo(test.pgn);
      if (test.shouldFail) {
        expect(isError(result)).toEqual(true);
      } else {
        expect(result).toEqual(succ(test.expectedResult));
      }
    });
  });
});

// ---- chessEngine.startGame() ----
test('testStartGame', () => {
  const [board, startingFen] = chessEngine.startGame();
  expect(startingFen).toStrictEqual(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  );
  expect(board.length).toStrictEqual(8);
  const countPeices = (
    board: ChessBoardPositions,
    color: PlayerColour,
  ): number => {
    let count = 0;
    board.forEach(row => {
      row.forEach(square => {
        if (square.piece?.player === color) {
          count += 1;
        }
      });
    });
    return count;
  };
  expect(countPeices(board, PlayerColour.White)).toStrictEqual(16);
  expect(countPeices(board, PlayerColour.Black)).toStrictEqual(16);
});
