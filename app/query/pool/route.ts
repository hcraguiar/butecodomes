import { Pool } from "@neondatabase/serverless";

const neon = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUsers() {
  const email = "fake@test.com";
  const name = "User Test";
  const query = `SELECT * FROM users WHERE email=$1 OR name=$2`;

  const client = await neon.connect();
  try {
    const result = await client.query(query, [email, name]);
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