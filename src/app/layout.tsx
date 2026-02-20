import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";
import type { Metadata } from "next";
import { M_PLUS_2 } from "next/font/google";
import "./globals.css";

const mPlus2 = M_PLUS_2({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-m-plus-2",
});

export const metadata: Metadata = {
  title: "title",
  description: "description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${mPlus2.variable}`}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
