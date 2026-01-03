import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  password: "Anagha@2906",
  host: "localhost",
  database: "trading_db",
  port: 5432
});

pool.query("SELECT current_database()")
  .then(res => console.log("CONNECTED TO DB:", res.rows[0].current_database))
  .catch(err => console.error("DB CONNECTION ERROR:", err.message));
