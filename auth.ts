import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Pool } from "@neondatabase/serverless";
import { compare } from "bcryptjs";
import { z } from "zod";

export const runtime = "edge";
const neon = new Pool({ connectionString: process.env.DATABASE_URL });


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("MissingFields");;
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const {email, password } = parsedCredentials.data;
          const client = await neon.connect();
          try {
            const result = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
            const user = result.rows[0];
            if (!user || !user.password) throw new Error("AccessDenied");
            const pwdMatch = await compare(password, user.password);
            if (!pwdMatch) throw new Error("InvalidCredentials");
            
            return { id: user.id, email: user.email } as any;
          } finally {
            client.release();
          }
        }
        throw new Error("InvalidCredentials");
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
            return '/login?error=AccessDenied';
          } else {
            if (!result.rows[0].password)
              return `/register/password?email=${user.email}`;
          }
          return true;
        } finally {
          client.release();
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user?.id;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60; // expira em 1 hora
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = String(token.id);
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    }
  },
})
