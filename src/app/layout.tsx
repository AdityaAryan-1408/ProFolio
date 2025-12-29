import type { Metadata } from "next";
import { Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Aditya Aryan",
  description: "Professional Portfolio for Aditya Aryan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${anton.variable} ${jetbrains.variable} font-mono bg-off-black text-off-white overflow-x-hidden cursor-none selection:bg-neon-lime selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}