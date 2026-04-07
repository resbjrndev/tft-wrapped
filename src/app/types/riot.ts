export interface TFTParticipant {
  puuid: string;
  placement?: number;
}

export interface TFTMatch {
  info: {
    tft_set_number?: number;
    game_datetime?: number;
    gameCreation?: number;
    participants?: TFTParticipant[];
  };
}

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface LatestSetMatchesResult {
  latestSetNumber: number | null;
  matches: TFTMatch[];
}

export interface WrappedResponse {
  account: RiotAccount;
  matches: LatestSetMatchesResult;
}

export type GamesByMonth = Record<string, number>;

export interface PlayerStats {
  totalGames: number;
  averagePlacement: number;
  top4Rate: number;
  gamesByMonth: GamesByMonth;
}

export interface PlayerStats {
  totalGames: number;
  averagePlacement: number;
  top4Rate: number;
  gamesByMonth: Record<string, number>;
}

