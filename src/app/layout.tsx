import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BoardLogic — AI Whiteboard Explainer Videos",
  description: "Type a prompt. Watch it explain itself. BoardLogic turns ideas into narrated, hand-drawn whiteboard videos.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F5] text-slate-900 selection:bg-slate-200">
        {children}
      </body>
    </html>
  );
}

