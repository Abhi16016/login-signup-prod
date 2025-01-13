import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Login Signup Prod",
  description: "Can be used in multiple projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
        {children}
        <Toaster />
        </Providers>
      </body>
    </html>
  );
}
