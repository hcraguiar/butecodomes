import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Pool } from "@neondatabase/serverless";
import { compare } from "bcryptjs";
import { z } from "zod";
import cuid from "cuid";

export const runtime = "edge";
const neon = new Pool({ connectionString: process.env.DATABASE_URL });


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const {email, password } = parsedCredentials.data;
          const client = await neon.connect();
          try {
            const result = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
            const user = result.rows[0];
            if (!user || !user.password) return null;
            const pwdMatch = await compare(password, user.password);
            if (!pwdMatch) return null;
            
            return { id: user.id, email: user.email } as any;
          } finally {
            client.release();
          }
        }
        return null;
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        const client = await neon.connect();
        try {
          const result = await client.query(`SELECT * FROM users WHERE email=$1`, [user.email]);
          if (result.rows.length === 0) {
            const id = cuid();
            await client.query(
              `INSERT INTO users (id, email, name, image)
              VALUES ($1, $2, $3, $4)`,
              [id, user.email, user.name ?? '', user.image ?? '']
            );
          }
          
          return true;
        } finally {
          client.release();
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    }
  },
})
