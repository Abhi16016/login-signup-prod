"use client";

import { signOut, signIn, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

export function Appbar() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center h-screen">
      {session?.user ? (
        <>
          <Avatar className=" flex">
            <AvatarImage
              src={session.user.avatar || "/placeholder-avatar.png"}
              alt="User Avatar"
            />
            <AvatarFallback>{session.user.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <span>{session.user.name}</span>

          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="cursor-pointer"
          >
            Signout
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => signIn()}
            className="cursor-pointer bg-blue-500 p-8 font-bold text-xl"
            variant="secondary"
           >
            Signin
          </Button>
        </>
      )}
    </div>
  );
}
