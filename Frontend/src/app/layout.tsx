import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layouts/Header";
import { ModalProvider } from "@/providers/ModalProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "MegaBot",
  description: "Por enquanto nada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} antialiased font-inter`}>
        <ModalProvider>
          <Header />
          {children}
        </ModalProvider>
        <Toaster />
      </body>
    </html>
  );
}
