"use client";

import { useEffect, useState } from "react";

interface TokenData {
  name: string;
  symbol: string;
  mint: string;
  logo: string;
}

export default function CosmoPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8080/connect");

    ws.onopen = () => console.log("connected to websocket");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.name && data.symbol) {
          setTokens((prev) => [data, ...prev].slice(0, 50));
        }
      } catch {
        console.error("Invalid WebSocket data");
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌌 Cosmo — Live New Tokens</h1>
      <div className="space-y-2">
        {tokens.map((t, i) => (
          <div key={i} className="p-3 border rounded flex items-center gap-3">
            {t.logo && (
              <img src={t.logo} alt={t.symbol} width={40} height={40} />
            )}
            <div>
              <p className="font-semibold">
                {t.name} ({t.symbol})
              </p>
              <p className="text-sm text-gray-500">{t.mint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
