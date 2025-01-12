import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: any) { 
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          await prisma.user.update({
            where: { email: user.email },
            data: {
              name: user.name,
              avatar: user.image,
            },
          });
        } else {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Unknown",
              avatar: user.image || "",
            },
          });
        }

        return true; 
        
      } catch (error) {
        console.error("Error saving user to the database:", error);
        return false; 
      }
    },
    async jwt({user,token}:any){
        if(user) {
            token.id = user.id
            token.name = user.name
            token.email = user.email
            token.avatar = user.image
        }

        return token
    },
    async session({session,token}:any) {
        if(token){
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.avatar = token.avatar
        }
        return session
    }
  },
};
