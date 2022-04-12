import React, { useContext, useState } from 'react';
import { Chess, Move } from 'chess.ts';

// The global state for the app
const ChessGameStateContext = React.createContext<
    [Chess, React.Dispatch<React.SetStateAction<Chess>>]
>([new Chess(), () => undefined]);

type ChessGameStateHookType = [
    {
        playMove: () => Move | null,
        generatePgn: () => string
    }
];

export const useChessGameStateContext = (): ChessGameStateHookType => {
    const [chessGameState, setChessGameState] = useContext(ChessGameStateContext);

    const playMove = () => {
        const moves = chessGameState.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        const result = chessGameState.move(move);
        return result;
    };

    const generatePgn = () => {
        return chessGameState.pgn();
    }

    return [{ playMove, generatePgn }];
};
