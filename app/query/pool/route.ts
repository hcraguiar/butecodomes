import { Pool } from "@neondatabase/serverless";

const neon = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUsers() {
  const email = "user@test.com";
  const query = `SELECT * FROM users WHERE email=$1`;

  const client = await neon.connect();
  try {
    const result = await client.query(query, [email]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    return Response.json(await getUsers());
  } catch (e) {
    return Response.json({ e }, { status: 500 });
  }
}