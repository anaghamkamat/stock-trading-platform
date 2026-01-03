import { useEffect, useRef, useState } from "react";
import api from "../api/api";

const SYMBOLS = ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN"];

export default function LiveTicker() {
  const [prices, setPrices] = useState({});
  const prevPrices = useRef({});

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/market/prices");
      prevPrices.current = prices;
      setPrices(res.data);
    };

    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [prices]);

  const trend = sym => {
    const prev = prevPrices.current[sym];
    const curr = prices[sym];
    if (!prev || !curr) return "→";
    return curr > prev ? "↑" : curr < prev ? "↓" : "→";
  };

  return (
    <div className="ticker">
      {SYMBOLS.map(sym => (
        <div key={sym} className="ticker-item">
          <b>{sym}</b>
          <span>
            ₹ {prices[sym] ?? "--"} {trend(sym)}
          </span>
        </div>
      ))}
    </div>
  );
}
