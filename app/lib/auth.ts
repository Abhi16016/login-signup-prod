import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { signUpSchema, signInSchema } from "../lib/zod";
import { Session, User, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "johndoe@example.com" },
        password: { label: "Password", type: "password" },
        confirmPassword: { label: "Confirm Password", type: "password", optional: true },
      },
      async authorize(
        credentials: Record<"email" | "password" | "confirmPassword", string> | undefined
      ): Promise<{ id: string; email: string | null } | null> {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { email, password, confirmPassword } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        if (confirmPassword) {
          // Signup Flow
          signUpSchema.parse({ email, password, confirmPassword });

          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser) {
            throw new Error("Email already in use.");
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
            },
          });

          return { id: newUser.id, email: newUser.email };
        } else {
          // Login Flow
          signInSchema.parse({ email, password });

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            throw new Error("No user found. Please sign up first.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password!);
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          return { id: user.id, email: user.email };
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: JWT;
      user?: User | null;
      account?: Account | null;
      profile?: Profile | null;
    }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.avatar =
          user.avatar || (account?.provider === "google" && profile?.picture ? profile.picture : null);
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.avatar = token.avatar as string | null;
      }
      return session;
    },
  },
};
