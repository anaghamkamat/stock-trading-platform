import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function PortfolioGraph({ value }) {
  const history =
    JSON.parse(localStorage.getItem("portfolioHistory") || "[]");

  const updatedHistory = [
    ...history,
    { time: new Date().toLocaleTimeString(), value }
  ].slice(-20); // keep last 20 points

  localStorage.setItem(
    "portfolioHistory",
    JSON.stringify(updatedHistory)
  );

  const data = {
    labels: updatedHistory.map(h => h.time),
    datasets: [
      {
        label: "Portfolio Value",
        data: updatedHistory.map(h => h.value),
        borderColor: "#1fa2c1",
        tension: 0.3,
        fill: false
      }
    ]
  };

  return (
    <div className="dashboard-card">
      <h3>Portfolio Performance</h3>
      <Line data={data} />
    </div>
  );
}
