export enum ChessPieceStyles {
  TORNELO = 'TORNELO',
  CLASSIC = 'CLASSIC',
}

export enum ChessBoardStyles {
  TORNELO = 'TORNELO',
  CLASSIC = 'CLASSIC',
}

export type GeneralSettings = {
  chessPieceStyle: ChessPieceStyles;
  chessBoardStyle: ChessBoardStyles;
};

export const defaulGeneralSettings: GeneralSettings = {
  chessPieceStyle: ChessPieceStyles.CLASSIC,
  chessBoardStyle: ChessBoardStyles.CLASSIC,
};
