import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meetly — Meeting Scheduler",
  description:
    "A modern meeting scheduling dashboard for organizing and managing appointments.",
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
