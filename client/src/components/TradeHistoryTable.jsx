import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const SYMBOLS = ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN"];

export default function SuggestedTrades() {
  const [prices, setPrices] = useState({});
  const prevPrices = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/market/prices");
      prevPrices.current = prices;
      setPrices(res.data);
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [prices]);

  const trend = (sym) => {
    const prev = prevPrices.current[sym];
    const curr = prices[sym];
    if (!prev || !curr) return "→";
    return curr > prev ? "↑" : curr < prev ? "↓" : "→";
  };

  const buyNow = (symbol, price) => {
    localStorage.setItem(
      "quickTrade",
      JSON.stringify({ symbol, price })
    );
    navigate("/trade");
  };

  return (
    <div className="dashboard-card">
      <h3>Suggested Trades</h3>

      {SYMBOLS.map(sym => (
        <div key={sym} className="suggested-row">
          <b>{sym}</b>
          <span>
            ₹ {prices[sym] ?? "--"} {trend(sym)}
          </span>
          <button
            className="small-btn"
            onClick={() => buyNow(sym, prices[sym])}
          >
            Buy
          </button>
        </div>
      ))}

      <p className="disclaimer">
        *Indicative prices. Not financial advice.
      </p>
    </div>
  );
}
