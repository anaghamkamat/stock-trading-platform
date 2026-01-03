import { useEffect, useState } from "react";
import api from "../api/api";

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState(
    JSON.parse(localStorage.getItem("alerts") || "[]")
  );
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/market/prices");
      setPrices(res.data);

      const remaining = alerts.filter(a => {
        const p = res.data[a.symbol];
        if (!p) return true;

        if (
          (a.type === "above" && p > a.price) ||
          (a.type === "below" && p < a.price)
        ) {
          alert(`🔔 ${a.symbol} is now ₹${p}`);
          return false; // remove after trigger
        }
        return true;
      });

      setAlerts(remaining);
      localStorage.setItem("alerts", JSON.stringify(remaining));
    };

    load();
    const i = setInterval(load, 10000);
    return () => clearInterval(i);
  }, [alerts]);

  if (alerts.length === 0) return null;

  return (
    <div className="dashboard-card">
      <h3>Active Alerts</h3>
      {alerts.map((a, i) => (
        <p key={i}>
          {a.symbol} {a.type === "above" ? ">" : "<"} ₹{a.price}
        </p>
      ))}
    </div>
  );
}
