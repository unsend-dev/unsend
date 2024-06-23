import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  AuthOptions,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session extends DefaultSession {
    user: {
      id: number;
      isBetaUser: boolean;
      isAdmin: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // eslint-disable-next-line no-unused-vars
  interface User {
    id: number;
    isBetaUser: boolean;
    isAdmin: boolean;
  }
}

/**
 * Auth providers
 */

const providers: Provider[] = [
  GitHubProvider({
    clientId: env.GITHUB_ID,
    clientSecret: env.GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (env.FROM_EMAIL) {
  providers.push(
    EmailProvider({
      from: env.FROM_EMAIL,
      async sendVerificationRequest({ identifier: email, url, token }) {
        await sendSignUpEmail(email, token, url);
      },
      async generateVerificationToken() {
        return Math.random().toString(36).substring(2, 7).toLowerCase();
      },
    })
  );
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        isBetaUser: user.isBetaUser,
        isAdmin: user.email === env.ADMIN_EMAIL,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/login",
  },
  events: {
    createUser: async ({ user }) => {
      // No waitlist for self hosting
      if (!env.NEXT_PUBLIC_IS_CLOUD) {
        await db.user.update({
          where: { id: user.id },
          data: { isBetaUser: true },
        });
      }
    },
  },
  providers,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

import { createHash } from "crypto";
import { sendSignUpEmail } from "./mailer";
import { Provider } from "next-auth/providers/index";

/**
 * Hashes a token using SHA-256.
 *
 * @param {string} token - The token to be hashed.
 * @returns {string} The hashed token.
 */
export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
