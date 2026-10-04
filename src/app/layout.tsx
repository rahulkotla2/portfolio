import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Roboto } from "next/font/google";
import { SITE_URL, SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cascadia = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-cascadia",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "Rahul Kotla",
    "Software Engineer",
    "Vue",
    "React",
    "Full-Stack",
    "EdTech",
    "FinTech",
    "Portfolio",
  ],
  authors: [{ name: "Rahul Kotla", url: SITE_URL }],
  creator: "Rahul Kotla",
  openGraph: {
    title: SITE.title,
    description: SITE.ogDescription,
    url: SITE_URL,
    siteName: "Rahul Kotla Portfolio",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Rahul Kotla — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.ogDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cascadia.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
