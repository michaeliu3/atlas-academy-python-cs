import type { Metadata } from "next";
import { DM_Mono, Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
});

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://atlas-academy-python-cs.michaelliumingchang.chatgpt.site",
  ),
  title: "Atlas Academy · Python & Computer Science",
  description:
    "Learn to read, understand, design, debug, and direct intelligent software systems.",
  openGraph: {
    title: "Atlas Academy",
    description: "See the whole system.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Atlas Academy — See the whole system.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Academy",
    description: "See the whole system.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
