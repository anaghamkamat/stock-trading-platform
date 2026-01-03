import { useEffect, useState } from "react";
import api from "../api/api";

export default function TradeHistoryTable() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    api.get("/trade/history").then(res => setTrades(res.data));
  }, []);

  if (trades.length === 0) return null;

  return (
    <div className="dashboard-card">
      <h3>Recent Trades</h3>

      <table className="trade-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price</th>
            <th>P/L</th>
          </tr>
        </thead>
        <tbody>
          {trades.slice(0, 5).map((t, i) => (
            <tr key={i}>
              <td>{t.symbol}</td>
              <td className={t.type === "BUY" ? "profit" : "loss"}>
                {t.type}
              </td>
              <td>{t.quantity}</td>
              <td>₹ {t.price}</td>
              <td className={t.pnl >= 0 ? "profit" : "loss"}>
                {t.pnl ?? "--"}
              </td>
              <button
  className="small-btn"
  onClick={() => {
    const wl = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (!wl.includes(sym)) {
      localStorage.setItem("watchlist", JSON.stringify([...wl, sym]));
      alert(`${sym} added to watchlist`);
    }
  }}
>
  ⭐
</button>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
