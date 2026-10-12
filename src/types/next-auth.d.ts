import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    roles: string[];
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
  }
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
    accessToken: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    error?: "RefreshTokenError";
  }
}
