import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historigal - Learn about history with a Google themed interface",
  description: "Search through 37,860 historical entries from 300 B.C. to 2012 with a Google-themed interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
