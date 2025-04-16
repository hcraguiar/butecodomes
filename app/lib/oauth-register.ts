import { Pool } from "@neondatabase/serverless";

const neon = new Pool({ connectionString: process.env.DATABASE_URL });


export async function registerUserFromOAuth(email: string, name: string | null, image: string | null, token: string) {
  const client = await neon.connect();

  try {
    await client.query('BEGIN');

    // Verifica se o token de convite é válido
    const inviteResult = await client.query(
      `SELECT * FROM "Invite" WHERE token = $1 AND "expiresAt" > now() AND "acceptedById" IS NULL`,
      [token]
    );

    if (inviteResult.rows.length === 0) {
      console.error("[OAuth Register] Convite inválido ou expirado", token);
      throw new Error('Invalid or expired invite');
    }

    // Cria o usuário manualmente
    const id = crypto.randomUUID();
    await client.query(
      `INSERT INTO users (id, email, name, image, "createdAt") VALUES ($1, $2, $3, $4, NOW())`,
      [id, email, name, image]
    );

    // Atualiza o convite com o novo usuário
    await client.query(
      `UPDATE "Invite" SET "acceptedById" = $1 WHERE token = $2`,
      [id, token]
    );

    await client.query('COMMIT');

    console.info("[OAuth Register] Usuário criado com sucesso:", email);
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("[OAuth Register] Erro ao registrar usuário:", (err as Error).message);
    return { success: false, error: (err as Error).message || "Unknown error" };
  } finally {
    client.release();
  }
}
