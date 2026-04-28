import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketSystem",
  description: "Sistema de catálogo de mercado com carrinho e fechamento via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
