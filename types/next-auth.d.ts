import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    avatar?: string | null; // Add the avatar property
  }

  interface Session {
    user: {
      id?: string | null; // Optional: Add ID if used in your session
      name?: string | null;
      email?: string | null;
      avatar?: string | null; // Add the avatar property
    };
  }
}
