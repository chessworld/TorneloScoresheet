import { Player } from '../types/ChessGameInfo';

export const fullName = (player: Player): string =>
  `${player.firstName} ${player.lastName}`;
