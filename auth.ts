import NextAuth from "next-auth";
import "next-auth/jwt"
import { prisma } from "@/prisma/prisma.service";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth ({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
  ],
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/dashboard") return !!auth;
      return true;
    },
    jwt({ token, trigger, session, account}) {
      if (trigger === "update") token.name = session.user.name;

      return token;
    },
    async session({ session, token}) {
      if (token?.accessToken) session.accessToken = token.accessToken;

      return session;
    },
  },
  experimental: {enableWebAuthn: true},
});

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
  }
}
