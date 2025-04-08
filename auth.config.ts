import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(error: Error) {
      console.error(`[NEXTAUTH ERROR] ${error.message}`, error);
    },
    warn(code) {
      console.warn(`[NEXTAUTH WARN] ${code}`);	
    },
    debug(code, metadata) {
      console.log(`[NEXTAUTH DEBUG] ${code}`, metadata);
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=true',
    signOut: '/',
  },
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [],
} satisfies NextAuthConfig;
