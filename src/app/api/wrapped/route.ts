import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from 'next'

type responseData = {
    gameName: string; 
    tagLine: string;
    year: number;
}

export default function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        
    }
}