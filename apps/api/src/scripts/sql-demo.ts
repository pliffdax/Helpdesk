import "dotenv/config";
import { Pool } from "pg";

async function run() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString });

  try {
    console.log("SQL demo started");

    const before = await pool.query(
      `SELECT t.id, t.title, t.status, c.name AS category_name
       FROM tickets t
       JOIN categories c ON c.id = t.category_id
       ORDER BY t.id ASC`,
    );
    console.log("SELECT result:", before.rows);

    const insert = await pool.query(
      `INSERT INTO tickets (title, description, status, priority, creator_id, category_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, title, status`,
      [
        "SQL demo ticket",
        "Created from pg client script",
        "OPEN",
        "LOW",
        1,
        1,
      ],
    );
    console.log("INSERT result:", insert.rows[0]);

    const createdId = insert.rows[0].id as number;

    const update = await pool.query(
      `UPDATE tickets
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, title, status`,
      ["RESOLVED", createdId],
    );
    console.log("UPDATE result:", update.rows[0]);

    const remove = await pool.query(
      `DELETE FROM tickets
       WHERE id = $1
       RETURNING id, title`,
      [createdId],
    );
    console.log("DELETE result:", remove.rows[0]);

    const after = await pool.query(
      `SELECT id, title, status
       FROM tickets
       ORDER BY id ASC`,
    );
    console.log("SELECT after cleanup:", after.rows);
  } finally {
    await pool.end();
  }
}

run().catch((error) => {
  console.error("SQL demo failed", error);
  process.exit(1);
});
