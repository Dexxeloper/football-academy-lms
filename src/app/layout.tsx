import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Academy LMS | Coach Education Platform",
  description: "Modern UEFA Tactical Education and Learning Management System for Football Academy Coaches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
