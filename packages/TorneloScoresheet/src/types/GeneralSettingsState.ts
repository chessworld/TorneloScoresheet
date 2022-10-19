export enum ChessPieceStyles {
  TORNELO,
  CLASSIC,
}

export type GeneralSettings = {
  chessPieceStyle: ChessPieceStyles;
};

export const defaulGeneralSettings: GeneralSettings = {
  chessPieceStyle: ChessPieceStyles.CLASSIC,
};
