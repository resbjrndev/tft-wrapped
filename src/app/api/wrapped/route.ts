import { RiotAPIService } from "@/app/lib/riot-api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const riotAPI = new RiotAPIService();
    try {
        const { gameName, tagLine, year } = await request.json();
        if (!gameName || !tagLine || !year) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }
        let account = await riotAPI.getAccountByRiotId(gameName, tagLine)
        let matches = await riotAPI.getAllMatchesForYear(account.puuid, year);
        return NextResponse.json({ account, matches });
    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}