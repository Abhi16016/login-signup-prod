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
import { signUpSchema } from "@/app/lib/zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation"; 

export default function Signup() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
  
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        redirect: false,
      });
  
      if (result?.error) {
        toast({
          title: "Signup Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup Successful",
          description: "Your account has been created.",
        });
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/" }).catch((error) => {
      console.error("Error during Google Signup:", error);
      toast({
        title: "Signup Failed",
        description: "An error occurred while signing up with Google.",
        variant: "destructive",
      });
    });
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
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
                "Signup"
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
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-sky-900"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign up with Google
        </Button>

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-500 underline">
            Signin
          </Link>
        </div>
      </div>
    </div>
  );
}
