import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shantanuwork.com"),

  title: {
    default: "ShantanuWorks™",
    template: "%s | ShantanuWorks™",
  },

  description:
    "Practical digital solutions including business websites, dashboard solutions, reporting systems, automation workflows, and AI-powered solutions.",

  applicationName: "ShantanuWorks",

  keywords: [
    "ShantanuWorks",
    "Website Development",
    "Dashboard Development",
    "Reporting Systems",
    "Automation",
    "AI Solutions",
    "Business Websites",
    "Data Visualization",
  ],

  authors: [
    {
      name: "ShantanuWorks",
    },
  ],

  creator: "ShantanuWorks",
  publisher: "ShantanuWorks",

  openGraph: {
    title: "ShantanuWorks™",
    description:
      "Design • Build • Automate • Deliver. Practical Digital Solutions. Measurable Results.",
    url: "https://www.shantanuwork.com",
    siteName: "ShantanuWorks™",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShantanuWorks™",
    description:
      "Practical Digital Solutions. Measurable Results.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}