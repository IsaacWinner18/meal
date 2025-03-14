import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Mealcoin",
  description: "Revolutionary Project on the blockchain, Game Changer!",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-t from-amber-800 via-amber-900 to-black antialiased sm:hidden`}
        >
          <Suspense>
            
          {children}
          </Suspense>
        </body>
      </html>
    </>
  );
}
