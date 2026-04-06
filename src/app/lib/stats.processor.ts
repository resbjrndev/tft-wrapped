import { PlayerStats, GamesByMonth } from '../types/riot';

export const processPlayerStats = (
  matches: any[],
  puuid: string,
  setNumber = 16
): PlayerStats => {
  console.log('matches', matches);

  const playerMatches = matches.map((match) =>
    match.info.participants.find((player: any) => player.puuid === puuid)
  );

  const averagePlacement =
    playerMatches.reduce((sum, player) => sum + player.placement, 0) /
    playerMatches.length;
  console.log('player placements', averagePlacement);

  console.log(playerMatches, '<<<< PLAYER MATCHES');

  return {
    totalGames: playerMatches.length,
    averagePlacement: 0,
    top4Rate: 0,
    gamesByMonth: { test: 0 }
  };
};
