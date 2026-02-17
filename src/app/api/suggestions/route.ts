import { RiotAPIService } from '@/app/lib/riot-api';
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') || '').trim();

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
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
      return NextResponse.json({ suggestions: [] });
    }
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
