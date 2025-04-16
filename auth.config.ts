import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // debug: true,
  // logger: {
  //   error(error: Error) {
  //     console.error(`[NEXTAUTH ERROR] ${error.message}`, error);
  //   },
  //   warn(code) {
  //     console.warn(`[NEXTAUTH WARN] ${code}`);	
  //   },
  //   debug(code, metadata) {
  //     console.log(`[NEXTAUTH DEBUG] ${code}`, metadata);
  //   },
  // },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1h
    updateAge: 30 * 60 // 30'
  },
  providers: [],
} satisfies NextAuthConfig;
