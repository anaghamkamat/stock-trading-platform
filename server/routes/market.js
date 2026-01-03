import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/prices", authMiddleware, async (req, res) => {
  const symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"];
  const prices = {};

  try {
    for (const s of symbols) {
      const r = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${s}&token=${process.env.FINNHUB_KEY}`
      );
      prices[s] = r.data.c; // current price
    }
    res.json(prices);
  } catch (e) {
    res.status(500).json({ message: "Price fetch failed" });
  }
});

export default router;
