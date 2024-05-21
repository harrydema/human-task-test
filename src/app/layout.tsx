import type { Metadata } from "next";
import { Inter } from "next/font/google";

import RootLayout from "@/layouts/RootLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Human Task Billing Demo",
  description: "This is a demo of a human task form for billing.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      style={{
        height: "100%",
      }}
      lang="en"
    >
      <body
        style={{ margin: "0px", padding: "0px", height: "100%" }}
        className={inter.className}
      >
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
