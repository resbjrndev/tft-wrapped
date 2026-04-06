import { PlayerStats, GamesByMonth } from "../types/riot"



export const processPlayerStats = (matches: any[], puuid: string): PlayerStats => {

console.log("matches", matches)
   const playerMatches = matches.map((match) => match.info.tft_.find((player: any) => player.puuid === puuid))
   const matchesForLastSet = matches.map((match) => match.info.participants.find((player: any) => player.puuid === puuid))


   console.log(playerMatches.length, "<<<< PLAYER MATCHES")


    const placementSum = matches.reduce((sum, match) => {


        console.log("player placement", playerPlacements)


    }, 0)





    return {
        totalGames: playerMatches.length,
        averagePlacement: 0,
        top4Rate: 0,
        gamesByMonth: { "test": 0 }
    }

}