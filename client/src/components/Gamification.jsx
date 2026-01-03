export default function Gamification({ trades, realizedPL }) {
  const tradeCount = trades.length;

  const level =
    tradeCount > 15 ? "Pro Trader" :
    tradeCount >= 5 ? "Trader" :
    "Beginner";

  const badges = [];
  if (tradeCount >= 1) badges.push("🎉 First Trade");
  if (realizedPL >= 10000) badges.push("💰 ₹10k Profit");
  if (tradeCount >= 5) badges.push("⚡ Active Trader");

  return (
    <div className="dashboard-card">
      <h3>Your Trading Profile</h3>

      <p><b>Level:</b> {level}</p>

      <div style={{ marginTop: 10 }}>
        {badges.length > 0
          ? badges.map((b, i) => <span key={i}>🏅 {b}<br /></span>)
          : <p>No badges yet</p>}
      </div>
    </div>
  );
}
