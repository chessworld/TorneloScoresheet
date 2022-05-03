import { Moment } from 'moment';

export type ChessGameInfo = {
  name: string;
  site: string;
  date: Moment;
  round?: number;
  game?: number;
  board: number;
  result: string;
  players: Player[];
  pgn: string;
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
  elo: number;
  country: string;
  fideId: number | undefined;
  team?: string;
};
