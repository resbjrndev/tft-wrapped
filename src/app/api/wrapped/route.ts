import { RiotAPIService } from '@/app/lib/riot-api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const riotAPI = new RiotAPIService();
  try {
    const { gameName, tagLine, year = '2024' } = await request.json();
    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const account = await riotAPI.getAccountByRiotId(gameName, tagLine);
    const matches = await riotAPI.getAllMatchesForYear(account.puuid);
    return NextResponse.json({ account, matches });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
