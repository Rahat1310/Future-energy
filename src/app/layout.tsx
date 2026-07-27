import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DeferredWhatsAppButton } from "@/components/marketing/deferred-whatsapp-button";
import { Providers } from "@/components/providers";
import { EnergyBackground } from "@/components/ui/energy-background";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Future Energy BD",
  description: "Your trusted green energy e-commerce store in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      >
        <body className="relative flex min-h-full flex-col">
          <EnergyBackground />
          <Providers>
            {children}
            <DeferredWhatsAppButton />
          </Providers>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
