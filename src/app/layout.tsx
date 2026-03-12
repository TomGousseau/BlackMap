import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackrock V2 — Explore the World",
  description: "A premium Apple-style maps experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
