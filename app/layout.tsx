import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getClinic, getNavigation } from "@/lib/mockContent";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clinic = getClinic();

export const metadata: Metadata = {
  metadataBase: new URL("https://medvitaclinic.com"),
  title: {
    default: `${clinic.name} — ${clinic.tagline}`,
    template: `%s | ${clinic.name}`,
  },
  description: clinic.description,
  keywords: [
    "clinic",
    "doctor",
    "medical",
    "appointment",
    "healthcare",
    "San Francisco",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medvitaclinic.com",
    siteName: clinic.name,
    title: `${clinic.name} — ${clinic.tagline}`,
    description: clinic.description,
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: clinic.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinic.name} — ${clinic.tagline}`,
    description: clinic.description,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = getNavigation();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-surface text-slate-900">
        <Header
          navItems={nav.main}
          clinicName={clinic.name}
          phone={clinic.phone}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer clinic={clinic} footerNav={nav.footer} />
        <Analytics />
      </body>
    </html>
  );
}
