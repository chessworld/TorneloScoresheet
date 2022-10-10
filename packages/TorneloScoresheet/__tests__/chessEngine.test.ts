import moment from 'moment';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import { BoardPosition, Position } from '../src/types/ChessBoardPositions';
import { PlayerColour } from '../src/types/ChessGameInfo';
import {
  Piece,
  PieceType,
  MoveSquares,
  PlyTypes,
  ChessPly,
  GameTime,
} from '../src/types/ChessMove';
import { isError, succ } from '../src/types/Result';
import { stripStarAndReplaceResultFromPgn } from '../testUtils/testUtils';

// ---- chessEngine.parseGameInfo() ----
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

const pgnTeamCountryElo = `[Event "Test Teams Again"]
[Site "Tornelo INT"]
[Date "2022.06.30"]
[Round "1.1.1"]
[White "Sambuev, Bator"]
[Black "Constantinou, Samuel Johannes"]
[Result "*"]
[BlackCountry "CYP"]
[BlackElo "1751"]
[BlackTeam "Chypre"]
[WhiteCountry "CAN"]
[WhiteElo "2497"]
[WhiteTeam "Québec A"]
[WhiteTitle "GM"]

*
`;

describe('parseGameInfo', () => {
  const testCases = [
    {
      name: 'ParsePgnSuccess',
      pgn: pgnSuccess,
      shouldFail: false,
      expectedResult: {
        name: 'Skywalker Challenge - A',
        site: 'Prague, Czechia',
        round: 6,
        board: 1,
        game: undefined,
        positionOccurances: {},
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnSuccess,
        players: [
          {
            color: 0,
            firstName: ' Anakin',
            lastName: 'Skywalker',
            elo: undefined,
            country: undefined,
            teamName: undefined,
            fideId: 600000,
          },
          {
            color: 1,
            firstName: ' Master',
            lastName: 'Yoda',
            elo: undefined,
            country: undefined,
            teamName: undefined,
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
        positionOccurances: {},
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnNoFIdeId,
        players: [
          {
            color: 0,
            firstName: ' Anakin',
            lastName: 'Skywalker',
            elo: undefined,
            country: undefined,
            teamName: undefined,
            fideId: undefined,
          },
          {
            color: 1,
            firstName: ' Master',
            lastName: 'Yoda',
            elo: undefined,
            country: undefined,
            teamName: undefined,
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
        positionOccurances: {},
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnNoFirstName,
        players: [
          {
            color: 0,
            firstName: ' ?',
            lastName: 'Skywalker',
            elo: undefined,
            country: undefined,
            teamName: undefined,
            fideId: 600000,
          },
          {
            color: 1,
            firstName: ' ?',
            lastName: 'Yoda',
            elo: undefined,
            country: undefined,
            teamName: undefined,
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
        game: undefined,
        round: undefined,
        positionOccurances: {},
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnOnlyBoard,
        players: [
          {
            color: 0,
            firstName: ' Anakin',
            lastName: 'Skywalker',
            elo: undefined,
            country: undefined,
            teamName: undefined,
            fideId: 600000,
          },
          {
            color: 1,
            firstName: ' Master',
            lastName: 'Yoda',
            elo: undefined,
            country: undefined,
            teamName: undefined,
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
        positionOccurances: {},
        result: '*',
        date: moment('2021.09.12', 'YYYY.MM.DD'),
        pgn: pgnBoardRoundGame,
        players: [
          {
            color: 0,
            firstName: ' Anakin',
            lastName: 'Skywalker',
            elo: undefined,
            country: undefined,
            teamName: undefined,
            fideId: 600000,
          },
          {
            color: 1,
            firstName: ' Master',
            lastName: 'Yoda',
            elo: undefined,
            country: undefined,
            teamName: undefined,
            fideId: 1000000,
          },
        ],
      },
    },
    {
      name: 'Pgn team, elo and country',
      shouldFail: false,
      pgn: pgnTeamCountryElo,
      expectedResult: {
        name: 'Test Teams Again',
        site: 'Tornelo INT',
        board: 1,
        game: 1,
        round: 1,
        positionOccurances: {},
        result: '*',
        date: moment('2022.06.30', 'YYYY.MM.DD'),
        pgn: pgnTeamCountryElo,
        players: [
          {
            color: 0,
            firstName: ' Bator',
            lastName: 'Sambuev',
            elo: 2497,
            country: 'CAN',
            fideId: undefined,
            teamName: 'Québec A',
          },
          {
            color: 1,
            firstName: ' Samuel Johannes',
            lastName: 'Constantinou',
            elo: 1751,
            country: 'CYP',
            fideId: undefined,
            teamName: 'Chypre',
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
  const startingFen = chessEngine.startingFen();
  expect(startingFen).toStrictEqual(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  );
});

// ---- chessEngine.fenToBoardPositions() ----
describe('fenToBoardPositions', () => {
  const testCases = [
    {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      expectedPositions: [
        {
          piece: {
            player: 0,
            type: 3,
          },
          position: 'a1',
        },
        {
          piece: {
            player: 0,
            type: 1,
          },
          position: 'b1',
        },
        {
          piece: {
            player: 0,
            type: 2,
          },
          position: 'c1',
        },
        {
          piece: {
            player: 0,
            type: 4,
          },
          position: 'd1',
        },
        {
          piece: {
            player: 0,
            type: 5,
          },
          position: 'e1',
        },
        {
          piece: {
            player: 0,
            type: 2,
          },
          position: 'f1',
        },
        {
          piece: {
            player: 0,
            type: 1,
          },
          position: 'g1',
        },
        {
          piece: {
            player: 0,
            type: 3,
          },
          position: 'h1',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'a2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'b2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'c2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'd2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'e2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'f2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'g2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'h2',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'a7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'b7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'c7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'd7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'e7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'f7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'g7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'h7',
        },
        {
          piece: {
            player: 1,
            type: 3,
          },
          position: 'a8',
        },
        {
          piece: {
            player: 1,
            type: 1,
          },
          position: 'b8',
        },
        {
          piece: {
            player: 1,
            type: 2,
          },
          position: 'c8',
        },
        {
          piece: {
            player: 1,
            type: 4,
          },
          position: 'd8',
        },
        {
          piece: {
            player: 1,
            type: 5,
          },
          position: 'e8',
        },
        {
          piece: {
            player: 1,
            type: 2,
          },
          position: 'f8',
        },
        {
          piece: {
            player: 1,
            type: 1,
          },
          position: 'g8',
        },
        {
          piece: {
            player: 1,
            type: 3,
          },
          position: 'h8',
        },
      ],
    },
    {
      fen: 'r3k2r/ppp2p1p/2n1p1p1/8/2B2P1q/2NPb1n1/PP4PP/R2Q3K w kq - 0 8',
      expectedPositions: [
        {
          piece: {
            player: 0,
            type: 3,
          },
          position: 'a1',
        },
        {
          piece: {
            player: 0,
            type: 4,
          },
          position: 'd1',
        },
        {
          piece: {
            player: 0,
            type: 5,
          },
          position: 'h1',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'a2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'b2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'g2',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'h2',
        },
        {
          piece: {
            player: 0,
            type: 1,
          },
          position: 'c3',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'd3',
        },
        {
          piece: {
            player: 1,
            type: 2,
          },
          position: 'e3',
        },
        {
          piece: {
            player: 1,
            type: 1,
          },
          position: 'g3',
        },
        {
          piece: {
            player: 0,
            type: 2,
          },
          position: 'c4',
        },
        {
          piece: {
            player: 0,
            type: 0,
          },
          position: 'f4',
        },
        {
          piece: {
            player: 1,
            type: 4,
          },
          position: 'h4',
        },
        {
          piece: {
            player: 1,
            type: 1,
          },
          position: 'c6',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'e6',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'g6',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'a7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'b7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'c7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'f7',
        },
        {
          piece: {
            player: 1,
            type: 0,
          },
          position: 'h7',
        },
        {
          piece: {
            player: 1,
            type: 3,
          },
          position: 'a8',
        },
        {
          piece: {
            player: 1,
            type: 5,
          },
          position: 'e8',
        },
        {
          piece: {
            player: 1,
            type: 3,
          },
          position: 'h8',
        },
      ],
    },
  ];

  const boardPositionsCorrect = (
    expectedPeices: BoardPosition[],
    board: BoardPosition[],
  ): boolean => {
    let correct = true;
    board.forEach(position => {
      const expectedPeice = expectedPeices.filter(
        value => value.position === position.position,
      );

      if (expectedPeice.length === 0) {
        // should be no piece here
        if (position.piece !== null) {
          correct = false;
        }
      } else {
        // should be a piece here
        if (
          position.piece?.player !== expectedPeice?.[0]?.piece?.player ||
          position.piece?.type !== expectedPeice?.[0]?.piece?.type
        ) {
          correct = false;
        }
      }
    });
    return correct;
  };

  testCases.forEach(test => {
    it(test.fen, () => {
      const boardPositions = chessEngine.fenToBoardPositions(test.fen);
      const correct = boardPositionsCorrect(
        test.expectedPositions as BoardPosition[],
        boardPositions,
      );
      expect(correct).toStrictEqual(true);
    });
  });
});

// ---- chessEngine.makeMove() ----
describe('makeMove', () => {
  const positions = [
    {
      name: 'en passant possiblility recorded',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: {
        from: 'e2',
        to: 'e4',
      },
      next: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      possible: true,
      piece: {
        type: PieceType.Pawn,
        player: PlayerColour.White,
      },
      san: 'e4',
    },
    {
      name: 'normal illegal move',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: {
        from: 'e2',
        to: 'e5',
      },
      next: 'rnbqkbnr/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      possible: false,
      piece: {
        type: PieceType.Pawn,
        player: PlayerColour.White,
      },
      san: 'e2e5',
    },
    {
      name: 'en passant capture',
      fen: 'rnbqkbnr/pp3ppp/2pp4/4pP2/4P3/8/PPPP2PP/RNBQKBNR w KQkq e6 0 1',
      move: {
        from: 'f5',
        to: 'e6',
      },
      next: 'rnbqkbnr/pp3ppp/2ppP3/8/4P3/8/PPPP2PP/RNBQKBNR b KQkq - 0 1',
      possible: true,
      piece: {
        type: PieceType.Pawn,
        player: PlayerColour.White,
      },
      captured: 'p',
      san: 'fxe6',
    },
    {
      name: 'checkmate',
      fen: '7k/3R4/3p2Q1/6Q1/2N1N3/8/8/3R3K w - - 0 1',
      move: {
        from: 'd7',
        to: 'd8',
      },
      next: '3R3k/8/3p2Q1/6Q1/2N1N3/8/8/3R3K b - - 1 1',
      possible: true,
      piece: {
        type: PieceType.Rook,
        player: PlayerColour.White,
      },
      san: 'Rd8#',
    },
    {
      name: 'en passant capture',
      fen: 'rnbqkbnr/pppp2pp/8/4p3/4Pp2/2PP4/PP3PPP/RNBQKBNR b KQkq e3 0 1',
      move: {
        from: 'f4',
        to: 'e3',
      },
      next: 'rnbqkbnr/pppp2pp/8/4p3/8/2PPp3/PP3PPP/RNBQKBNR w KQkq - 0 2',
      possible: true,
      captured: 'p',
      piece: {
        type: PieceType.Pawn,
        player: PlayerColour.Black,
      },
      san: 'fxe3',
    },
    {
      name: 'regular move',
      fen: 'r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7',
      next: 'r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8',
      possible: true,
      move: {
        from: 'g8',
        to: 'e7',
      },
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.Black,
      },
      san: 'Ne7',
    },
    {
      name: 'capture',
      fen: 'rnb1kbnr/ppppqp1p/8/4p1p1/2P1N3/8/PP1PPPPP/R1BQKBNR w KQkq - 0 1',
      next: 'rnb1kbnr/ppppqp1p/8/4p1N1/2P5/8/PP1PPPPP/R1BQKBNR b KQkq - 0 1',
      possible: true,
      move: {
        from: 'e4',
        to: 'g5',
      },
      captured: 'p',
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.White,
      },
      san: 'Nxg5',
    },
    {
      name: 'illegal move',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      next: 'rnbqkbnr/pNpppppp/8/8/8/8/PPPPPPPP/R1BQKBNR b KQkq - 0 1',
      possible: false,
      move: {
        from: 'b1',
        to: 'b7',
      },
      captured: 'p',
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.White,
      },
      san: 'Nb1xb7',
    },
    {
      name: 'impossible move -> from is not our piece',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      next: '',
      possible: false,
      move: {
        from: 'b5',
        to: 'b7',
      },
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.White,
      },
      san: 'b7',
    },
    {
      name: 'impossible move -> to is our piece',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      next: '',
      possible: false,
      move: {
        from: 'b1',
        to: 'c1',
      },
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.White,
      },
      san: 'c1',
    },
    {
      name: ' impossible move -> from is not on board',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      next: '',
      possible: false,
      move: {
        from: 'k1',
        to: 'c1',
      },
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.White,
      },
      san: 'c1',
    },
    {
      name: 'impossible move -> to is not on board',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      next: '',
      possible: false,
      move: {
        from: 'b1',
        to: 'p1',
      },
      piece: {
        type: PieceType.Knight,
        player: PlayerColour.White,
      },
      san: 'p1',
    },
  ];
  const boardCorrect = (
    board: BoardPosition[],
    pliePosition: MoveSquares,
    piece: Piece,
  ): boolean => {
    const fromSquare = board.find(
      square => square.position === pliePosition.from,
    );
    const toSquare = board.find(square => square.position === pliePosition.to);
    if (fromSquare && toSquare) {
      return (
        fromSquare.piece === null &&
        toSquare.piece !== null &&
        toSquare.piece.player === piece.player &&
        toSquare.piece?.type === piece.type
      );
    } else {
      return true;
    }
  };
  positions.forEach(function (position) {
    it(position.name, function () {
      const nextFenResult = chessEngine.makeMove(
        position.fen,
        {
          from: position.move.from as Position,
          to: position.move.to as Position,
        },
        undefined,
      );
      if (position.possible) {
        expect(nextFenResult !== null).toBe(true);
        if (nextFenResult !== null) {
          const [nextfen] = nextFenResult;
          const board = chessEngine.fenToBoardPositions(nextfen);
          expect(
            nextfen &&
              nextfen === position.next &&
              boardCorrect(
                board,
                {
                  from: position.move.from as Position,
                  to: position.move.to as Position,
                },
                position.piece,
              ),
          ).toBe(true);
        }
      } else {
        expect(nextFenResult).toBeNull();
      }
    });

    const moveSanResult = chessEngine.makeMove(
      position.fen,
      {
        from: position.move.from as Position,
        to: position.move.to as Position,
      },
      undefined,
      undefined,
    );
    if (position.possible) {
      expect(moveSanResult !== null).toBe(true);
      if (moveSanResult !== null) {
        const [, nextsan] = moveSanResult;
        expect(nextsan).toEqual(position.san);
      }
    } else {
      expect(moveSanResult).toBeNull();
    }
  });
});

// ----- chessEngine.isPawnPromotion() ----

describe('isPromotion', function () {
  const testCases = [
    {
      name: 'legal move non-promotion',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      san: 'e4',
      move: { from: 'e2', to: 'e4' },
      promotion: false,
    },
    {
      name: 'illegal move + promotion',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      san: 'e8',
      move: { from: 'e2', to: 'e8' },
      promotion: true,
    },
    {
      name: 'no piece on from',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      san: 'e4',
      move: { from: 'e3', to: 'e4' },
      promotion: false,
    },
    {
      name: 'illegal promotion due to discovery',
      fen: '1K6/2P2k2/8/8/5b2/8/8/8 w - - 0 1',
      san: 'c8',
      move: { from: 'c7', to: 'c8' },
      promotion: true,
    },
    {
      name: 'illegal move non-capturing diagonal + promotion',
      fen: '8/2P2k2/8/8/8/5K2/8/8 w - - 0 1',
      san: 'b8',
      move: { from: 'c7', to: 'b8' },
      promotion: true,
    },
    {
      name: 'legal promotion',
      fen: '8/2P2k2/8/8/8/5K2/8/8 w - - 0 1',
      san: 'c8',
      move: { from: 'c7', to: 'c8' },
      promotion: true,
    },
    {
      name: 'legal capturing promotion',
      fen: '1b6/2P2k2/8/8/5K2/8/8/8 w - - 0 1',
      san: 'cxb8',
      move: { from: 'c7', to: 'b8' },
      promotion: true,
    },
    {
      name: 'illegal move white moving pawn to its own start row -> no promotion',
      fen: 'rnbqkbnr/pppppp1p/6p1/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1',
      san: '',
      move: { from: 'g2', to: 'g1' },
      promotion: false,
    },
    {
      name: 'illegal move black moving pawn to its own start row -> no promotion',
      fen: 'rnbqkb1r/pppppppp/7n/8/6P1/5N2/PPPPPP1P/RNBQKB1R b KQkq - 0 1',
      san: '',
      move: { from: 'g7', to: 'g8' },
      promotion: false,
    },
  ];

  testCases.forEach(function (testCase) {
    it(testCase.name, function () {
      expect(
        chessEngine.isPawnPromotion(testCase.fen, testCase.move as MoveSquares),
      ).toBe(testCase.promotion);
    });
  });
});

// ---- chessEngine.skipTurn() ----
describe('Skip Turn', () => {
  const testCases = [
    {
      name: 'white move skip',
      startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      expectedFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1',
    },
    {
      name: 'black move skip',
      startingFen: 'rnbqkbnr/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 1 1',
      expectedFen: 'rnbqkbnr/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 2 2',
    },
  ];

  testCases.forEach(testCase => {
    it(testCase.name, () => {
      const resultingFen = chessEngine.skipTurn(testCase.startingFen);
      expect(resultingFen).toStrictEqual(testCase.expectedFen);
    });
  });
});

// ---- chessEngine.isOtherPlayersPiece() ----
describe("is other player's piece", () => {
  const testCases = [
    {
      name: 'White turn own piece',
      startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: { from: 'e2', to: 'e4' },
      isOtherPlayersPiece: false,
    },
    {
      name: "White turn Black's piece",
      startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: { from: 'e8', to: 'e5' },
      isOtherPlayersPiece: true,
    },
    {
      name: 'Black turn own piece',
      startingFen:
        'rnbqkbnr/pppp2pp/8/4p3/4Pp2/2PP4/PP3PPP/RNBQKBNR b KQkq e3 0 1',
      move: { from: 'f4', to: 'e3' },
      isOtherPlayersPiece: false,
    },
    {
      name: "Black turn white's piece",
      startingFen:
        'rnbqkbnr/pppp2pp/8/4p3/4Pp2/2PP4/PP3PPP/RNBQKBNR b KQkq e3 0 1',
      move: { from: 'a1', to: 'a5' },
      isOtherPlayersPiece: true,
    },
  ];

  testCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = chessEngine.isOtherPlayersPiece(
        testCase.startingFen,
        testCase.move as MoveSquares,
      );
      expect(result).toStrictEqual(testCase.isOtherPlayersPiece);
    });
  });
});

// ---- chessEngine.addComments() ----
describe('Adding Comments', () => {
  const gameTime: GameTime = { hours: 1, minutes: 1 };
  const testCases = [
    {
      name: 'Adding game time comment',
      pgn: pgnSuccess,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
          gameTime: gameTime,
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') +
        '1. e4 {[%clk 01:01]} 1-0',
    },
    {
      name: 'Adding draw offer comment',
      pgn: pgnSuccess,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
          drawOffer: true,
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e4 {=} 1-0',
    },
    {
      name: 'Adding game time and draw offer comments',
      pgn: pgnSuccess,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
          gameTime: gameTime,
          drawOffer: true,
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') +
        '1. e4 {=[%clk 01:01]} 1-0',
    },
  ];
  testCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = chessEngine.generatePgn(
        testCase.pgn,
        testCase.moves,
        testCase.winner,
        false,
      );
      if (!isError(result)) {
        expect(result.data).toStrictEqual(testCase.expectedPgn);
      }
    });
  });
});

// ---- chessEngine.generatePgn() ----
describe('generatePgn', () => {
  const testCases = [
    {
      name: 'White win no error',
      pgn: pgnSuccess,
      isError: false,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e4 1-0',
      allowSkips: false,
    },
    {
      name: 'Skip ply error',
      pgn: pgnSuccess,
      isError: true,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.Black,
          type: PlyTypes.SkipPly,
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e4 1-0',
      allowSkips: false,
    },
    {
      name: 'Skip ply no error',
      pgn: pgnSuccess,
      isError: false,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.Black,
          type: PlyTypes.SkipPly,
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e4 - 1-0',
      allowSkips: true,
    },
    {
      name: 'Parse PGN error',
      pgn: '',
      isError: true,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e4 1-0',
      allowSkips: false,
    },
    {
      name: 'Impossible move error',
      pgn: pgnSuccess,
      isError: true,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e3',
            to: 'e4',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e4 1-0',
      allowSkips: false,
    },
    {
      name: 'Black win no error',
      pgn: pgnSuccess,
      isError: false,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'g7',
            to: 'g6',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.Black,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '0-1') + '1. e4 g6 0-1',
      allowSkips: false,
    },
    {
      name: 'Draw win no error',
      pgn: pgnSuccess,
      isError: false,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'g7',
            to: 'g6',
          },
        },
      ] as ChessPly[],
      winner: null,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-1') + '1. e4 g6 1-1',
      allowSkips: false,
    },
    {
      name: 'Illegal move',
      pgn: pgnSuccess,
      isError: true,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e6',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') + '1. e2e6 1-0',
      allowSkips: false,
    },
    {
      name: 'En Passant move',
      pgn: pgnSuccess,
      isError: false,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd5',
          },
        },
        {
          moveNo: 3,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e4',
            to: 'e5',
          },
        },
        {
          moveNo: 4,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'f7',
            to: 'f5',
          },
        },
        {
          moveNo: 5,
          startingFen:
            'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e5',
            to: 'f6',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') +
        '1. e4 d5 2. e5 f5 3. exf6 1-0',
      allowSkips: false,
    },
    {
      name: 'Capture',
      isError: false,
      pgn: pgnSuccess,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd5',
          },
        },
        {
          moveNo: 3,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e4',
            to: 'd5',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') +
        '1. e4 d5 2. exd5 1-0',
      allowSkips: false,
    },
    {
      name: 'Check symbol',
      pgn: pgnSuccess,
      isError: false,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'g2',
            to: 'g4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNR b KQkq g3 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'f7',
            to: 'f5',
          },
        },
        {
          moveNo: 3,
          startingFen:
            'rnbqkbnr/ppppp1pp/8/5p2/6P1/8/PPPPPP1P/RNBQKBNR w KQkq f6 0 2',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'g4',
            to: 'f5',
          },
        },
        {
          moveNo: 4,
          startingFen:
            'rnbqkbnr/ppppp1pp/8/5P2/8/8/PPPPPP1P/RNBQKBNR b KQkq - 0 2',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'e7',
            to: 'e6',
          },
        },
        {
          moveNo: 5,
          startingFen:
            'rnbqkbnr/pppp2pp/4p3/5P2/8/8/PPPPPP1P/RNBQKBNR w KQkq - 0 3',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'f5',
            to: 'f6',
          },
        },
        {
          moveNo: 6,
          startingFen:
            'rnbqkbnr/pppp2pp/4pP2/8/8/8/PPPPPP1P/RNBQKBNR b KQkq - 0 3',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e6',
            to: 'e5',
          },
        },
        {
          moveNo: 7,
          startingFen:
            'rnbqkbnr/pppp2pp/5P2/4p3/8/8/PPPPPP1P/RNBQKBNR w KQkq - 0 4',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'f6',
            to: 'f7',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') +
        '1. g4 f5 2. gxf5 e6 3. f6 e5 4. f7+ 1-0',
      allowSkips: false,
    },
    {
      name: 'check mate',
      isError: false,
      pgn: pgnSuccess,
      moves: [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd5',
          },
        },
        {
          moveNo: 3,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e4',
            to: 'd5',
          },
        },
      ] as ChessPly[],
      winner: PlayerColour.White,
      expectedPgn:
        stripStarAndReplaceResultFromPgn(pgnSuccess, '1-0') +
        '1. e4 d5 2. exd5 1-0',
      allowSkips: false,
    },
  ];

  testCases.forEach(testCase => {
    test(testCase.name, () => {
      const result = chessEngine.generatePgn(
        testCase.pgn,
        testCase.moves,
        testCase.winner,
        testCase.allowSkips,
      );
      expect(isError(result)).toStrictEqual(testCase.isError);
      if (!isError(result)) {
        expect(result.data).toStrictEqual(testCase.expectedPgn);
      }
    });
  });
});
