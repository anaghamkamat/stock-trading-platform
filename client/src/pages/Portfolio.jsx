import { useEffect, useState } from "react";
import api from "../api/api";

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, p] = await Promise.all([
          api.get("/trade/holdings"),
          api.get("/market/prices")
        ]);
        setHoldings(h.data);
        setPrices(p.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page">Loading portfolio...</div>;

  const totalInvested = holdings.reduce(
    (s, h) => s + h.quantity * h.avg_price,
    0
  );

  const totalValue = holdings.reduce((s, h) => {
    const price = prices[h.symbol] || h.avg_price;
    return s + price * h.quantity;
  }, 0);

  const overallPL = totalValue - totalInvested;

  return (
    <div className="page">
      <h1>Portfolio</h1>

      {/* ===== SUMMARY ===== */}
      <div className="card-grid">
        <div className="stat-card">
          <h3>Total Value</h3>
          <p>₹ {totalValue.toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>Invested</h3>
          <p>₹ {totalInvested.toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>Overall P/L</h3>
          <p className={overallPL >= 0 ? "profit" : "loss"}>
            ₹ {overallPL.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ===== HOLDINGS GRID ===== */}
      <div className="portfolio-grid">
        {holdings.map(h => {
          const price = prices[h.symbol] || h.avg_price;
          const value = price * h.quantity;
          const pl = value - h.quantity * h.avg_price;

          return (
            <div key={h.symbol} className="portfolio-card animate">
              <div className="portfolio-header">
                <h2>{h.symbol}</h2>
                <span className={pl >= 0 ? "profit" : "loss"}>
                  ₹ {pl.toFixed(2)}
                </span>
              </div>

              <div className="portfolio-body">
                <div>
                  <span>Qty</span>
                  <b>{h.quantity}</b>
                </div>
                <div>
                  <span>Avg</span>
                  <b>₹ {h.avg_price}</b>
                </div>
                <div>
                  <span>LTP</span>
                  <b>₹ {price}</b>
                </div>
                <div>
                  <span>Value</span>
                  <b>₹ {value.toFixed(2)}</b>
                </div>
              </div>

              <button className="small-btn danger">
                Sell
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
