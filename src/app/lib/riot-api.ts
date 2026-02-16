import axios from "axios";

const RIOT_API_BASE_URL = "https://europe.api.riotgames.com";

export class RiotAPIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || "";
  }

  async getAccountByRiotId(gameName: string, tagLine: string) {
    let taglineClean = tagLine.replace("#", "");
    const response = await axios.get(
      `${RIOT_API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${taglineClean}`,
      {
        headers: { "X-Riot-Token": this.apiKey },
      },
    );
    return response.data;
  }

  async getMatchIdsByPuuid(
    puuid: string,
    start: number = 0,
    count: number = 20,
  ) {
    const response = await axios.get(
      `${RIOT_API_BASE_URL}/tft/match/v1/matches/by-puuid/${puuid}/ids`,
      {
        params: { start, count },
        headers: { "X-Riot-Token": this.apiKey },
      },
    );
    return response.data;
  }

  getMatchById(matchId: string) {
    return axios
      .get(`${RIOT_API_BASE_URL}/tft/match/v1/matches/${matchId}`, {
        headers: { "X-Riot-Token": this.apiKey },
      })
      .then((response) => response.data);
  }

  async getAllMatchesForYear(puuid: string, year = 2024) {
    const allMatchIds: string[] = [];
    let start = 0;
    const count = 100; //max per request

    while (true) {
      const matchIds = await this.getMatchIdsByPuuid(puuid, start, count);

      if (matchIds.length === 0) break;

      allMatchIds.push(...matchIds);

      if (matchIds.length < count) break;
      start += count;

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const matches = await Promise.all(
      allMatchIds.map((matchId) => this.getMatchById(matchId)),
    );

    const yearStart = new Date(`${year}-01-01`).getTime();
    const yearEnd = new Date(`${year}-12-31`).getTime();

    return matches.filter((match) => {
      const matchTime = match.info.game_datetime;
      return matchTime >= yearStart && matchTime <= yearEnd;
    });
  }
}
