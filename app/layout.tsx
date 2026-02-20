import type { Metadata } from "next";
import { M_PLUS_2 } from "next/font/google";
import "./globals.css";

import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import AmplifyProvider from "./AmplifyProvider";

const mPlus2 = M_PLUS_2({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-m-plus-2",
});

export const metadata: Metadata = {
  title: "title",
  description: "description",
};

Amplify.configure(outputs, { ssr: true });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${mPlus2.variable}`}>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}
