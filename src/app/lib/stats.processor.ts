import { PlayerStats } from '../types/riot';
import { TFTMatch, TFTParticipant } from '../types/riot';

const EMPTY_STATS: PlayerStats = {
  totalGames: 0,
  averagePlacement: 0,
  top4Rate: 0,
  gamesByMonth: {}
};

export const processPlayerStats = (
  matches: unknown,
  puuid: string,
  setNumber: number
): PlayerStats => {
  if (!Array.isArray(matches) || !puuid) return EMPTY_STATS;

  const typedMatches = matches as TFTMatch[];

  const setMatches = typedMatches.filter(
    (m) => m?.info?.tft_set_number === setNumber
  );

  const playerRows = setMatches
    .map((m) => m?.info?.participants?.find((p) => p?.puuid === puuid))
    .filter((p): p is TFTParticipant => Boolean(p));

  const placements = playerRows
    .map((p) => p.placement)
    .filter((n): n is number => typeof n === 'number');

  if (placements.length === 0) return EMPTY_STATS;

  const placementSum = placements.reduce((sum, n) => sum + n, 0);
  const averagePlacement = placementSum / placements.length;

  const top4Count = placements.filter((p) => p <= 4).length;
  const top4Rate = (top4Count / placements.length) * 100;

  const gamesByMonth = setMatches.reduce<Record<string, number>>(
    (acc, match) => {
      const ts = match?.info?.game_datetime ?? match?.info?.gameCreation;
      if (!ts) return acc;
      const key = new Date(ts).toISOString().slice(0, 7); // YYYY-MM
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalGames: placements.length,
    averagePlacement: Number(averagePlacement.toFixed(2)),
    top4Rate: Number(top4Rate.toFixed(1)),
    gamesByMonth
  };
};
