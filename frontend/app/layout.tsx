import type { Metadata } from "next";
import { Space_Grotesk, Open_Sans } from "next/font/google";
import "./globals.css";

// Display font — untuk semua heading (slogan, judul section)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Body font — untuk semua teks isi
const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Minion Barbershop",
  description: "Elite Cuts for the Next Gen",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${openSans.variable} h-full antialiased`}>
      <body
        className={`${spaceGrotesk.variable} ${openSans.variable} min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
