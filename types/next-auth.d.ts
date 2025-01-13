import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    avatar?: string | null; 
  }

  interface Session {
    user: {
      id?: string | null; 
      email?: string | null;
      avatar?: string | null; 
    };
  }
}
