"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [orderParams, setOrderParams] = useState(`{
    "exchange": "NSE",
    "tradingsymbol": "INFY",
    "transaction_type": "BUY",
    "quantity": 1,
    "order_type": "MARKET",
    "product": "CNC"
  }`);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Extract access_token from URL if present
    const url = new URL(window.location.href);
    const token = url.searchParams.get("access_token");
    if (token) {
      setAccessToken(token);
      // Remove token from URL for cleanliness
      url.searchParams.delete("access_token");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, []);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    try {
      const res = await fetch("/api/zerodha/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          orderParams: JSON.parse(orderParams),
        }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(err.message);
    }
  }

  function handleRenewToken() {
    setAccessToken("");
    window.location.href = "/api/zerodha/login";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <section className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">AutoTrade: Zerodha Order Placement</h1>
        <p className="mb-4 text-gray-700">
          <b>AutoTrade</b> is a demo platform that allows users to authenticate with Zerodha and place stock orders directly using the official Kite Connect API.<br/>
          <span className="text-sm text-gray-500">(For demonstration purposes only. Do not use real credentials on public/shared servers.)</span>
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-600">
          <li>Login securely with your Zerodha account</li>
          <li>Obtain your access token after authentication</li>
          <li>Place equity orders using the Kite Connect API</li>
        </ul>
      </section>

      {!accessToken ? (
        <section className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">1. Login with Zerodha</h2>
          <p className="mb-4 text-gray-700">Click below to authenticate with Zerodha and obtain your access token.</p>
          <Link href="/api/zerodha/login">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition mb-2 w-full sm:w-auto">
              Login with Zerodha
            </button>
          </Link>
        </section>
      ) : (
        <>
          <section className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Renew Access Token</h2>
            <p className="mb-4 text-gray-700">If your session expires or you want to renew your access token, click below.</p>
            <button onClick={handleRenewToken} className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition w-full sm:w-auto">
              Renew Token
            </button>
          </section>
          <section className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">2. Place an Order</h2>
            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
              <label className="font-semibold">Order Parameters (JSON)</label>
              <textarea
                className="border px-3 py-2 rounded h-40 font-mono text-base text-gray-900 bg-gray-100 focus:bg-white focus:text-black focus:outline-blue-500 placeholder-gray-400"
                value={orderParams}
                onChange={e => setOrderParams(e.target.value)}
                required
              />
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
                Place Order
              </button>
            </form>
            {result && (
              <pre className="mt-6 bg-gray-100 p-4 rounded w-full overflow-x-auto text-xs text-gray-900">
                {result}
              </pre>
            )}
          </section>
        </>
      )}

      <footer className="text-center text-gray-400 text-xs mt-8">
        &copy; {new Date().getFullYear()} AutoTrade Demo. Powered by Next.js & Kite Connect.
      </footer>
    </main>
  );
}
