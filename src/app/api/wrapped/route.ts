import { RiotAPIService } from '@/app/lib/riot-api';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  if (!process.env.RIOT_API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing on the server' },
      { status: 500 }
    );
  }

  const riotAPI = new RiotAPIService();
  try {
    const { gameName, tagLine } = await request.json();
    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await riotAPI.getAccountByRiotId(gameName, tagLine);
    const puuid =
      typeof account === 'string'
        ? account
        : (account as { puuid: string }).puuid;
    const matches = await riotAPI.getLatestSetMatchesForPlayerSimple(puuid);
    return NextResponse.json({ account, matches });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Riot API request failed',
          status: error.response?.status,
          detail: error.response?.data || error.message
        },
        { status: error.response?.status || 502 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong', detail: String(error) },
      { status: 500 }
    );
  }
}
