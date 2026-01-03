import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import tradeRoutes from "./routes/trade.js";
import marketRoutes from "./routes/market.js";
import assistantRoutes from "./routes/assistant.js";

/* =========================
   CREATE APP FIRST
========================= */
const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RATE LIMITER (ASSISTANT)
========================= */
const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/assistant", assistantLimiter, assistantRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("DB NAME:", process.env.DB_NAME);
  console.log(`Server running on port ${PORT}`);
});
