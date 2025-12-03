import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Super admin navigation screen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
