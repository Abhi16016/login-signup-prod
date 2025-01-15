"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signin() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "You are now logged in.",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" }).catch((error) => {
      console.error("Error during Google Signin:", error);
      toast({
        title: "Signin Failed",
        description: "An error occurred while signing in with Google.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Signin</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Please wait...
                </>
              ) : (
                "Signin"
              )}
            </Button>
          </form>
        </Form>

        <div className="my-4 flex items-center justify-between">
          <div className="border-t flex-1 border-gray-300"></div>
          <span className="mx-2 text-gray-500">or</span>
          <div className="border-t flex-1 border-gray-300"></div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-sky-900"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign in with Google
        </Button>

        <div className="mt-4 text-center">
          Don&ops;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-500 underline">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
