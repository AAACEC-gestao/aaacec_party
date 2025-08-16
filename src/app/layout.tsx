import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
export const metadata: Metadata = {
  title: "3D",
  description: "Placar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
