import { Moment } from 'moment';

export type ChessGameInfo = {
  name: string;
  site: string;
  date: Moment;
  round?: number;
  game?: number;
  board: number;
  result: string;
  players: [Player, Player];
  pgn: string;
};

export type ChessGameResult = {
  winner: PlayerColour | null;
  gamePgn?: string;
  signature: Record<PlayerColour, string>;
};

export enum PlayerColour {
  White,
  Black,
}

export const PLAYER_COLOUR_NAME: Record<PlayerColour, string> = {
  0: 'White',
  1: 'Black',
};

export type Player = {
  color: PlayerColour;
  firstName: string;
  lastName: string;
  elo: number | undefined;
  country: string | undefined;
  teamName: string | undefined;
  fideId: number | undefined;
};
