import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";
import { M_PLUS_2 } from "next/font/google";
import "./globals.css";

const mPlus2 = M_PLUS_2({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-m-plus-2",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${mPlus2.variable}`}>
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
