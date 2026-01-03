import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { pool } from "../db.js";
import OpenAI from "openai";

const router = express.Router();

/* =========================
   OPENAI CLIENT (FIXED)
========================= */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20000,   // ⏱️ 20 seconds timeout
  maxRetries: 2,    // 🔁 retry automatically
});

/* =========================
   GPT ASSISTANT ROUTE
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userMessage = req.body.message;

    /* =========================
       FETCH USER PORTFOLIO
    ========================= */
    const holdingsRes = await pool.query(
      "SELECT symbol, quantity, avg_price FROM holdings WHERE user_id=$1",
      [req.user.id]
    );

    const holdings = holdingsRes.rows;

    const portfolioText =
      holdings.length === 0
        ? "User has no holdings."
        : holdings
            .map(
              h => `${h.symbol}: ${h.quantity} shares at ₹${h.avg_price}`
            )
            .join(", ");

    /* =========================
       GPT CALL
    ========================= */
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ fastest & reliable
      messages: [
        {
          role: "system",
          content: `
You are a stock trading assistant.
You give educational guidance only.
No financial guarantees.

User portfolio:
${portfolioText}
          `,
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.6,
      max_tokens: 150,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err) {
    console.error("OPENAI ERROR:", err);

    /* =========================
       GRACEFUL FALLBACK
    ========================= */
    res.json({
      reply:
        "⚠️ AI is temporarily slow due to network issues.\n\n" +
        "You can still:\n" +
        "• Review your holdings\n" +
        "• Check unrealized profit/loss\n" +
        "• Decide selling if stock is in profit\n\n" +
        "Please try again in a moment 🙂",
    });
  }
});

export default router;
