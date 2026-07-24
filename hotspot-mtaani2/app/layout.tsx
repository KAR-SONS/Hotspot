import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "@/components/pwa/register-sw";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Hotspot Mtaani — Earn Money From Your WiFi",
  description:
    "Turn your WiFi connection into a profitable business. Create packages, manage hotspots, and start earning today with Hotspot Mtaani.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hotspot Mtaani",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f9653",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}

