import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layouts/Header";
import { ModalProvider } from "@/providers/ModalProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { getAuthTokens } from "@/lib/cookies";
import { MainContentProvider } from "@/providers/MainContentProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "SiConn",
  description: "Por enquanto nada",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const is_logged_in = (await getAuthTokens()).accessToken !== null;
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} antialiased font-inter`}>
        <AuthProvider is_logged_in={is_logged_in}>
          <MainContentProvider>
            <ModalProvider>
              <Header />
              {children}
            </ModalProvider>
          </MainContentProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
