import { NextRequest, NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

export async function GET(req: NextRequest) {
  const apiKey = process.env.KITE_API_KEY!;
  const apiSecret = process.env.KITE_API_SECRET!;
  const { searchParams } = new URL(req.url);
  const requestToken = searchParams.get("request_token");

  if (!requestToken) {
    return new NextResponse("Missing request_token", { status: 400 });
  }

  const kite = new KiteConnect({ api_key: apiKey });
  try {
    const session = await kite.generateSession(requestToken, apiSecret);
    // Redirect to home page with access_token in query string
    const origin = req.headers.get("origin") || `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`;
    const redirectUrl = `${origin}/?access_token=${session.access_token}`;
    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
} 