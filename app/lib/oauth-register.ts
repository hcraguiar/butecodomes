import { Pool } from "@neondatabase/serverless";

const neon = new Pool({ connectionString: process.env.DATABASE_URL });


export async function registerUserFromOAuth(email: string, name: string | null, image: string | null, token: string) {
  const client = await neon.connect();

  try {
    await client.query('BEGIN');

    // Verifica se o token de convite é válido
    const inviteResult = await client.query(
      `SELECT * FROM Invite WHERE token = $1 AND expires_at > now() AND accepted_by_id IS NULL`,
      [token]
    );

    if (inviteResult.rows.length === 0) {
      throw new Error('Invalid or expired invite');
    }

    // Cria o usuário manualmente
    const id = crypto.randomUUID();
    await client.query(
      `INSERT INTO users (id, email, name, image, created_at) VALUES ($1, $2, $3, $4, NOW())`,
      [id, email, name, image]
    );

    // Atualiza o convite com o novo usuário
    await client.query(
      `UPDATE Invite SET accepted_by_id = $1 WHERE token = $2`,
      [id, token]
    );

    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    return { success: false, error: err };
  } finally {
    client.release();
  }
}
