import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { pool } from "../db.js";

const router = express.Router();

/* BUY */
router.post("/buy", authMiddleware, async (req, res) => {
  let { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  symbol = symbol.toUpperCase();
  quantity = Number(quantity);
  price = Number(price);

  const cost = price * quantity;

  const user = await pool.query(
    "SELECT balance FROM users WHERE id=$1",
    [userId]
  );

  if (user.rows[0].balance < cost) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  await pool.query(
    "UPDATE users SET balance = balance - $1 WHERE id=$2",
    [cost, userId]
  );

  await pool.query(
    "INSERT INTO trades (user_id, symbol, quantity, price, type) VALUES ($1,$2,$3,$4,'BUY')",
    [userId, symbol, quantity, price]
  );

  const holding = await pool.query(
    "SELECT * FROM holdings WHERE user_id=$1 AND symbol=$2",
    [userId, symbol]
  );

  if (holding.rows.length === 0) {
    await pool.query(
      "INSERT INTO holdings (user_id, symbol, quantity, avg_price) VALUES ($1,$2,$3,$4)",
      [userId, symbol, quantity, price]
    );
  } else {
    const h = holding.rows[0];
    const newQty = h.quantity + quantity;
    const newAvg =
      (h.avg_price * h.quantity + price * quantity) / newQty;

    await pool.query(
      "UPDATE holdings SET quantity=$1, avg_price=$2 WHERE id=$3",
      [newQty, newAvg, h.id]
    );
  }

  res.json({ message: "Stock bought successfully" });
});

/* SELL */
router.post("/sell", authMiddleware, async (req, res) => {
  let { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  symbol = symbol.toUpperCase();
  quantity = Number(quantity);
  price = Number(price);

  const holdingRes = await pool.query(
    "SELECT * FROM holdings WHERE user_id=$1 AND symbol=$2",
    [userId, symbol]
  );

  if (holdingRes.rows.length === 0 || holdingRes.rows[0].quantity < quantity) {
    return res.status(400).json({ message: "Not enough stock to sell" });
  }

  const holding = holdingRes.rows[0];
  const realizedPnL = (price - holding.avg_price) * quantity;

  await pool.query(
    "UPDATE users SET balance = balance + $1 WHERE id=$2",
    [price * quantity, userId]
  );

  await pool.query(
    "INSERT INTO trades (user_id, symbol, quantity, price, type, pnl) VALUES ($1,$2,$3,$4,'SELL',$5)",
    [userId, symbol, quantity, price, realizedPnL]
  );

  const remaining = holding.quantity - quantity;

  if (remaining === 0) {
    await pool.query("DELETE FROM holdings WHERE id=$1", [holding.id]);
  } else {
    await pool.query(
      "UPDATE holdings SET quantity=$1 WHERE id=$2",
      [remaining, holding.id]
    );
  }

  res.json({ message: "Stock sold successfully" });
});

/* HOLDINGS */
router.get("/holdings", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT symbol, quantity, avg_price FROM holdings WHERE user_id=$1",
    [req.user.id]
  );
  res.json(result.rows);
});

/* TRADE HISTORY */
router.get("/history", authMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT symbol, quantity, price, type, pnl, created_at
     FROM trades WHERE user_id=$1
     ORDER BY created_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

export default router;
