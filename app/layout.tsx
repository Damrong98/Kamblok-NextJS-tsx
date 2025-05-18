import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import Theme from "./Theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kamblok Chat",
  description: "Explore Kamblok, the AI text generator for teaching, writing, and more. Boost education with our free AI tools today!",
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
        cz-shortcut-listen="true"
      >
        <ThemeProvider 
          attribute="class"
          defaultTheme="system" 
          enableSystem
        >
          <Theme>
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
