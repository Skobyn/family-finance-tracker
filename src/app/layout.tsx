import type { Metadata } from "next";

// Note: Using system fonts as fallback to avoid network dependency during build
// import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/firebase-auth-provider";

// Configure Inter font (commented out to use system fonts during offline builds)
// const inter = Inter({
//   subsets: ["latin"],
//   variable: '--font-inter',
// });

export const metadata: Metadata = {
  title: "Achievr",
  description: "Track and manage your family's finances with Achievr",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
