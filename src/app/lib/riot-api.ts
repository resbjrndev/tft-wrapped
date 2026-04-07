import axios from 'axios';
import { TFTMatch } from '../types/riot';

const RIOT_API_BASE_URL = 'https://europe.api.riotgames.com';
const PAGE_SIZE = 10;
const BATCH_SIZE = 5;
const PAGE_DELAY_MS = 250;
const BATCH_DELAY_MS = 300;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RiotAPIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || '';
  }

  async getLatestSetMatchesForPlayerSimple(puuid: string, count = 20) {
    const ids = await this.getMatchIdsByPuuid(puuid, 0, count);
    const matches = await Promise.all(
      ids.map((id: string) => this.getMatchById(id))
    );

    if (!matches.length) return { latestSetNumber: null, matches: [] };

    const latestSetNumber = matches[0]?.info?.tft_set_number ?? null;
    const latestSetMatches = matches.filter(
      (m) => m?.info?.tft_set_number === latestSetNumber
    );

    return { latestSetNumber, matches: latestSetMatches };
  }

  async getAccountByRiotId(gameName: string, tagLine: string): Promise<string> {
    const taglineClean = tagLine.replace('#', '');
    const response = await axios.get(
      `${RIOT_API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${taglineClean}`,
      {
        headers: { 'X-Riot-Token': this.apiKey }
      }
    );
    console.log('Account response:', response.data);
    return response.data;
  }

  async getMatchIdsByPuuid(
    puuid: string,
    start: number = 0,
    count: number = 20
  ) {
    const response = await axios.get(
      `${RIOT_API_BASE_URL}/tft/match/v1/matches/by-puuid/${puuid}/ids`,
      {
        params: { start, count },
        headers: { 'X-Riot-Token': this.apiKey }
      }
    );
    console.log(
      `Match IDs for puuid ${puuid} (start=${start}, count=${count}):`,
      response.data
    );
    return response.data;
  }

  getMatchById(matchId: string) {
    return axios
      .get(`${RIOT_API_BASE_URL}/tft/match/v1/matches/${matchId}`, {
        headers: { 'X-Riot-Token': this.apiKey }
      })
      .then((response) => response.data);
  }

  async getAllMatchesForYear(puuid: string, year: number, maxMatches = 20) {
    const allMatchIds: string[] = [];
    let start = 0;
    const count = PAGE_SIZE;

    while (allMatchIds.length < maxMatches) {
      const matchIds = await this.getMatchIdsByPuuid(puuid, start, count);

      if (matchIds.length === 0) break;

      allMatchIds.push(...matchIds);

      if (matchIds.length < count) break;
      start += count;

      await sleep(PAGE_DELAY_MS);
    }

    const cappedMatchIds = allMatchIds.slice(0, maxMatches);
    const matches: TFTMatch[] = [];

    for (let index = 0; index < cappedMatchIds.length; index += BATCH_SIZE) {
      const batch = cappedMatchIds.slice(index, index + BATCH_SIZE);
      const batchMatches = await Promise.all(
        batch.map((matchId) => this.getMatchById(matchId))
      );
      matches.push(...batchMatches);

      if (index + BATCH_SIZE < cappedMatchIds.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    const yearStart = new Date(`${year}-01-01`).getTime();
    const yearEnd = new Date(`${year}-12-31`).getTime();

    console.log(
      `Filtering matches for year ${year} (timestamps between ${yearStart} and ${yearEnd})`
    );
    return matches.filter((match) => {
      const matchTime = match.info.game_datetime;
      return matchTime != null && matchTime >= yearStart && matchTime <= yearEnd;
    });
  }
}
