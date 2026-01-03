import { useEffect, useState } from "react";
import api from "../api/api";

export default function TradeHistory() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    api.get("/trade/history").then(res => setTrades(res.data));
  }, []);

  return (
    <div className="page">
      <h1>Trade History</h1>

      {trades.length === 0 && <p>No trades yet.</p>}

      {trades.map((t, i) => (
        <div key={i} className="trade-item">
          <b>{t.symbol}</b>
          <span>{t.type}</span>
          <span>Qty: {t.quantity}</span>
          <span>₹ {t.price}</span>
          <span>{new Date(t.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
