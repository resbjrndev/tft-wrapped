export type GamesByMonth = Record<string, number>;

export interface PlayerStats {
    totalGames: number;
    averagePlacement: number;
    top4Rate: number;
    gamesByMonth: GamesByMonth;
}