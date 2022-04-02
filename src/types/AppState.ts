export enum AppStateVariant {
  ArbiterSetup,
  TablePairing,
  PlayerScoresheetRecording,
  ResultDisplay,
}

export type ArbiterSetupMode = {
  mode: AppStateVariant.ArbiterSetup;
};

export type TablePairingMode = {
  mode: AppStateVariant.TablePairing;
  games: number;
};

export type PlayerScoresheetRecordingMode = {
  mode: AppStateVariant.PlayerScoresheetRecording;
  table: number;
  scores: number[];
};

export type AppState =
  | ArbiterSetupMode
  | TablePairingMode
  | PlayerScoresheetRecordingMode;
