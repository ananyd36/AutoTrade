import { NextRequest, NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

export async function GET(req: NextRequest) {
  const apiKey = process.env.KITE_API_KEY!;
  const kite = new KiteConnect({ api_key: apiKey });
  const loginUrl = kite.getLoginURL();
  return NextResponse.redirect(loginUrl);
} 