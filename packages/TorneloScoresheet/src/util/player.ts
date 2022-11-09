import { Player, PlayerColour } from '../types/ChessGameInfo';

export const fullName = (player: Player): string =>
  `${player.firstName} ${player.lastName}`;

export const playerColourAsIndex = (player: PlayerColour) => {
  return player === PlayerColour.White ? 0 : 1;
};
