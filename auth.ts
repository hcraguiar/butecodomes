import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Client, Pool } from "@neondatabase/serverless";
import { compare } from "bcryptjs";
import { z } from "zod";
import { User } from "@prisma/client";
import { userAgent } from "next/server";

export const runtime = "edge"; //Autenticação rodando em Edge

const neon = new Pool({ connectionString: process.env.DATABASE_URL });


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obigatórios");
        }
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const {email, password } = parsedCredentials.data;
          const client = await neon.connect();
          try {
            const result = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
            const user = result.rows[0];
            console.log("passei aqui", user)
            if (!user || !user.password) {
              throw new Error("Usuário não encontrado");
            }
            const pwdMatch = await compare(password, user.password);
            if (!pwdMatch) {
              throw new Error("Senha incorreta");
            }
            
            return { id: user.id, email: user.email } as any;
          } finally {
            client.release();
          }
        }
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    })
  ],
})
