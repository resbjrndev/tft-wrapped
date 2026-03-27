import { RiotAPIService } from '@/app/lib/riot-api';
import { NextRequest, NextResponse } from 'next/server';

type ErrorWithStatus = { response?: { status?: number } };
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Accept both q and query to match the frontend.
  const query = (
    searchParams.get('q') ||
    searchParams.get('query') ||
    ''
  ).trim();

  if (query.length < 3) return NextResponse.json({ suggestions: [] });

  const [rawGameName = '', rawTagLine = ''] = query.split('#', 2);
  const gameName = rawGameName.trim();
  const tagLine = rawTagLine.trim();
  if (!gameName || !tagLine) return NextResponse.json({ suggestions: [] });

  try {
    const riotAPI = new RiotAPIService();
    const account = await riotAPI.getAccountByRiotId(gameName, tagLine);

    return NextResponse.json({
      suggestions: [`${account.gameName}#${account.tagLine}`]
    });
  } catch (error) {
    const status = (error as ErrorWithStatus)?.response?.status;
    if (status === 404) {
      return NextResponse.json({ suggestions: [] });
    }
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
