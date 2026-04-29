import type { Metadata } from "next";
import { DM_Serif_Display, Nunito } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "LeafLine | The Neighborhood Ledger for Better Plants",
  description: "Join your local plant swap club. Secure neighborhood exchanges, pest-free cuttings, and high-trust community gardening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${nunito.variable} font-sans bg-[#FAF6F1] text-[#3D2B1F]`}>
        {children}
      </body>
    </html>
  );
}