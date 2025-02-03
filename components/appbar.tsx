"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

export function Appbar() {
  const { data: session, status } = useSession();
  const router = useRouter(); 

  if (status === "loading") {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 m-4">
      {session?.user ? (
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={session.user.avatar ?? "/placeholder-avatar.png"}
              alt={`${session.user.email}'s avatar`}
            />
          </Avatar>

          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="cursor-pointer"
          >
            Signout
          </Button>
        </div>
      ) : (
        <>
          <Button
            onClick={() => router.push("/auth/signin")} 
            className="cursor-pointer bg-blue-500 p-6 font-bold text-xl"
            variant="secondary"
          >
            Signin
          </Button>
          <Button
            onClick={() => router.push("/auth/signup")} 
            className="cursor-pointer bg-green-500 p-6 ml-4 font-bold text-xl"
            variant="secondary"
          >
            Signup
          </Button>
        </>
      )}
    </div>
  );
}
