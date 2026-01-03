import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Watchlist() {
  const [list, setList] = useState(
    JSON.parse(localStorage.getItem("watchlist") || "[]")
  );
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
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [prices]);

  const trend = sym => {
    const p = prevPrices.current[sym];
    const c = prices[sym];
    if (!p || !c) return "→";
    return c > p ? "↑" : c < p ? "↓" : "→";
  };

  const remove = sym => {
    const updated = list.filter(s => s !== sym);
    setList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const trade = (symbol, price) => {
    localStorage.setItem(
      "quickTrade",
      JSON.stringify({ symbol, price })
    );
    navigate("/trade");
  };

  if (list.length === 0) return null;

  return (
    <div className="dashboard-card">
      <h3>Watchlist</h3>

      {list.map(sym => (
        <div key={sym} className="suggested-row">
          <b>{sym}</b>
          <span>
            ₹ {prices[sym] ?? "--"} {trend(sym)}
          </span>
          <button className="small-btn" onClick={() => trade(sym, prices[sym])}>
            Trade
          </button>
          <button
            className="small-btn secondary"
            onClick={() => remove(sym)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
