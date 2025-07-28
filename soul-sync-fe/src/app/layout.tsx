import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JournalProvider } from "@/context/JournalContext";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ReactQueryProvider } from "@/providers/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soul Sync",
  description: "Mental health, self-reflection, AI therapy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <UserProvider>
            <JournalProvider>{children}</JournalProvider>
          </UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
