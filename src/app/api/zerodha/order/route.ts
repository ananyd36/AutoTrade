import { NextRequest, NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";

export async function POST(req: NextRequest) {
  const apiKey = process.env.KITE_API_KEY!;
  const apiSecret = process.env.KITE_API_SECRET!;
  const body = await req.json();
  const { access_token, orderParams } = body;

  if (!access_token || !orderParams) {
    return new NextResponse("Missing access_token or orderParams", { status: 400 });
  }

  const kite = new KiteConnect({ api_key: apiKey });
  kite.setAccessToken(access_token);

  try {
    const order = await kite.placeOrder("regular", orderParams);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
} 