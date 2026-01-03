export default function TradeHeatmap({ holdings, prices }) {
  if (!holdings.length) return null;

  return (
    <div className="dashboard-card">
      <h3>Portfolio Heatmap</h3>

      <div className="heatmap">
        {holdings.map(h => {
          const current = prices[h.symbol] || h.avg_price;
          const pnl = (current - h.avg_price) * h.quantity;

          return (
            <div
              key={h.symbol}
              className="heat-tile"
              style={{
                background:
                  pnl > 0
                    ? "rgba(76,175,80,0.7)"
                    : pnl < 0
                    ? "rgba(255,82,82,0.7)"
                    : "rgba(200,200,200,0.4)"
              }}
            >
              <b>{h.symbol}</b>
              <span>₹ {pnl.toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
