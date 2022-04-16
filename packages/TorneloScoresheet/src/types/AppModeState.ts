export enum AppMode {
  ArbiterSetup,
  TablePairing,
  PlayerScoresheetRecording,
  ResultDisplay,
}

export type ArbiterSetupMode = {
  mode: AppMode.ArbiterSetup;
};

export type TablePairingMode = {
  mode: AppMode.TablePairing;
  games: number;
};

export type PlayerScoresheetRecordingMode = {
  mode: AppMode.PlayerScoresheetRecording;
  table: number;
  scores: number[];
};

export type AppModeState =
  | ArbiterSetupMode
  | TablePairingMode
  | PlayerScoresheetRecordingMode;
