import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SmoothScroller } from "@/components/smooth-scroller";
const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Audiox | Anonymous Voice Messages",
  description:
    "Share what you can't say freely. Anonymous, encrypted, and voice-only.",
  icons: {
    icon: "/sound-waves.png",
    apple: "/sound-waves.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={`font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <SmoothScroller>
          {children}
          <Toaster />
        </SmoothScroller>
      </body>
    </html>
  );
}
