import React, { useEffect, useState } from "react";
import api from "../api/api";
import ConfirmModal from "../components/ConfirmModal";

export default function Trade() {
  const [prices, setPrices] = useState({});
  const [holdings, setHoldings] = useState([]);

  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    price: ""
  });

  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  /* LOAD MARKET PRICES + USER HOLDINGS */
  useEffect(() => {
    api.get("/market/prices").then(res => setPrices(res.data));
    api.get("/trade/holdings").then(res => setHoldings(res.data));

    // Prefill from Suggested Trades
    const quick = JSON.parse(localStorage.getItem("quickTrade") || "{}");
    if (quick.symbol) {
      setForm({
        symbol: quick.symbol,
        quantity: "",
        price: quick.price || ""
      });
      localStorage.removeItem("quickTrade");
    }
  }, []);

  /* PROFIT / LOSS PREVIEW */
  const plPreview = (() => {
    if (!form.symbol || !form.quantity) return null;

    const h = holdings.find(x => x.symbol === form.symbol);
    if (!h) return null;

    const marketPrice = prices[form.symbol];
    if (!marketPrice) return null;

    return (marketPrice - h.avg_price) * Number(form.quantity);
  })();

  /* SUBMIT TRADE */
  const submit = async (type) => {
    if (!form.symbol || !form.quantity || !form.price) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/trade/${type}`, {
        symbol: form.symbol.toUpperCase(),
        quantity: Number(form.quantity),
        price: Number(form.price)
      });

      alert(`${type.toUpperCase()} successful`);
      setForm({ symbol: "", quantity: "", price: "" });

    } catch (err) {
      alert(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Trade</h1>

      <div className="trade-card">
        <input
          placeholder="Symbol (AAPL)"
          value={form.symbol}
          onChange={e =>
            setForm({ ...form, symbol: e.target.value.toUpperCase() })
          }
        />

        <small>
          Market Price: ₹ {prices[form.symbol] ?? "--"}
        </small>

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Buy / Sell Price"
          value={form.price}
          onChange={e =>
            setForm({ ...form, price: e.target.value })
          }
        />

        {/* PROFIT / LOSS PREVIEW */}
        {plPreview !== null && (
          <p
            className={plPreview >= 0 ? "profit" : "loss"}
            style={{ marginTop: 12, fontWeight: "bold" }}
          >
            Estimated P/L if sold now: ₹ {plPreview.toFixed(2)}
          </p>
        )}

        <button
          className="primary"
          disabled={loading}
          onClick={() => setConfirm("buy")}
        >
          Buy
        </button>

        <button
          className="secondary"
          disabled={loading}
          onClick={() => setConfirm("sell")}
        >
          Sell
        </button>
        <button
  className="small-btn"
  onClick={() => {
    const a = JSON.parse(localStorage.getItem("alerts") || "[]");
    localStorage.setItem(
      "alerts",
      JSON.stringify([
        ...a,
        { symbol: form.symbol, price: Number(form.price), type: "above" }
      ])
    );
    alert("Price alert added");
  }}
>
  🔔 Alert if Above
</button>

      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          submit(confirm);
          setConfirm(null);
        }}
        text={`
Action: ${confirm?.toUpperCase()}
Stock: ${form.symbol}
Quantity: ${form.quantity}
Price: ₹${form.price}
Total Value: ₹${(form.quantity * form.price).toFixed(2)}
        `}
      />
    </div>
  );
}
