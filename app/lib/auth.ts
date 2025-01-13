import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { signUpSchema, signInSchema } from "../lib/zod";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "johndoe@example.com" },
        password: { label: "Password", type: "password" },
        confirmPassword: { label: "Confirm Password", type: "password", optional: true },
      },
      async authorize(credentials) {
        const { email, password, confirmPassword } = credentials ?? {};

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

          return { id: newUser.id, email: newUser.email, avatar: newUser.avatar };
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

          return { id: user.id, email: user.email, avatar: user.avatar };
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ user, token, account }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.avatar = user.avatar || (account?.provider === "google" ? user.image : "/placeholder-avatar.png");
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
};
