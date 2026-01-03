import { useEffect, useState } from "react";
import api from "../api/api";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

import SuggestedTrades from "../components/SuggestedTrades";
import TradeHistoryTable from "../components/TradeHistoryTable";
import LiveTicker from "../components/LiveTicker";
import Watchlist from "../components/Watchlist";
import PortfolioGraph from "../components/PortfolioGraph";
import TradeHeatmap from "../components/TradeHeatmap";

export default function Dashboard() {
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

        setHoldings(h.data || []);
        setPrices(p.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="page">Loading dashboard...</div>;

  const invested = holdings.reduce(
    (s, h) => s + h.quantity * h.avg_price,
    0
  );

  const pieData = {
    labels: holdings.map(h => h.symbol),
    datasets: [{
      data: holdings.map(h => h.quantity * h.avg_price),
      backgroundColor: [
        "#1fa2c1", "#4caf50", "#ff9800", "#e91e63"
      ]
    }]
  };

  return (
    <div className="page">

      <h1>Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="card-grid animate">
        <Stat title="Holdings" value={holdings.length} />
        <Stat title="Invested" value={`₹ ${invested}`} />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="dashboard-grid">

        <div className="dashboard-card animate">
          <h3>Portfolio Allocation</h3>
          {holdings.length > 0 ? (
            <div className="chart-wrapper">
              <Pie data={pieData} />
            </div>
          ) : (
            <Empty text="No holdings yet" />
          )}
        </div>

        <div className="dashboard-card animate">
          <h3>Portfolio Performance</h3>
          {holdings.length > 0 ? (
            <PortfolioGraph />
          ) : (
            <Empty text="No performance data" />
          )}
        </div>

      </div>

      {/* ================= LIVE ================= */}
      <LiveTicker />

      {/* ================= LOWER GRID ================= */}
      <div className="dashboard-grid">

        <div className="dashboard-card animate">
          <TradeHistoryTable />
        </div>

        <div className="dashboard-card animate">
          <SuggestedTrades />
        </div>

        <div className="dashboard-card animate">
          <TradeHeatmap holdings={holdings} prices={prices} />
        </div>

        <div className="dashboard-card animate">
          <Watchlist />
        </div>

      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ opacity: 0.6, padding: 40 }}>
      {text}
    </div>
  );
}
