import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventSphere AI",
  description: "Premium Event & Media Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <SocketProvider>
            {/* Global Background gradients */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#8FAD88]/20 blur-[120px] pointer-events-none z-[-1]" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C1D5C0]/20 blur-[120px] pointer-events-none z-[-1]" />

            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster theme="light" position="bottom-right" />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
