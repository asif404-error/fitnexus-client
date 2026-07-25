import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import HeroUIProviderWrapper from "@/providers/HeroUIProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FitPulse - Fitness & Gym Management Platform",
  description:
    "Your all-in-one fitness and gym management platform. Track workouts, join classes, book sessions, and connect with the fitness community.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-theme-primary text-theme-primary">
        <ThemeProvider>
          <HeroUIProviderWrapper>
            <QueryProvider>
              <AuthProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </AuthProvider>
            </QueryProvider>
          </HeroUIProviderWrapper>
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card)",
              color: "var(--text-primary)",
              border: "1px solid var(--card-border)",
            },
          }}
        />
      </body>
    </html>
  );
}
