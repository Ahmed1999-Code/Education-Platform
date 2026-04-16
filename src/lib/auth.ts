import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// authOptions is defined here (not in the route file) so that:
// 1. It can be imported by other server code (e.g. getServerSession)
// 2. The route file only exports HTTP method handlers, satisfying Next.js 15
//    strict route type checking which rejects non-HTTP named exports.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: "/en/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.xp = user.xp;
        token.level = user.level;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.xp = token.xp as number;
        session.user.level = token.level as number;
      }
      return session;
    }
  }
};
