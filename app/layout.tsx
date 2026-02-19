import type { Metadata } from "next";
import "./globals.css";

import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import AmplifyProvider from "./AmplifyProvider";

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
      <body>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}
