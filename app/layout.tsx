import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/header";
import Footer from "./_components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ebnto",
  description:
    "ebento is an online events platform to connect people with similar interest around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 grow">{children}</main>
          <Footer />
        </div>

        <Toaster
          position="top-left"
          toastOptions={{
            classNames: {
              error: "!bg-red-100 !text-red-600 !border-red-200",
              success: "!bg-green-100 !text-green-600 !border-green-200",
            },
          }}
        />
      </body>
    </html>
  );
}
