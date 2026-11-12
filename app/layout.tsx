import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { LangProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GurujiWidget from "@/components/GurujiWidget";
import Chrome from "@/components/Chrome";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} – ${SITE.slogan}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_IN", url: SITE.url, title: `${SITE.name} – ${SITE.slogan}`, description: SITE.description },
  twitter: { card: "summary_large_image", title: `${SITE.name} – ${SITE.slogan}`, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#0F172A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
        <LangProvider>
          <Chrome top={<Header />} bottom={<><Footer /><GurujiWidget /></>}>
            <main id="main">{children}</main>
          </Chrome>
        </LangProvider>
        <JsonLd data={{
          "@context": "https://schema.org", "@graph": [
            { "@type": "Organization", "@id": `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/brand/icon-512.png`, slogan: SITE.slogan, description: SITE.description,
              contactPoint: [{ "@type": "ContactPoint", telephone: SITE.phone, email: SITE.email, contactType: "sales", areaServed: "IN", availableLanguage: ["English", "Hindi"] }],
              owns: { "@type": "WebSite", name: "SDGVIEW", url: SITE.sdgview } },
            { "@type": "WebSite", "@id": `${SITE.url}/#site`, url: SITE.url, name: SITE.name, publisher: { "@id": `${SITE.url}/#org` }, inLanguage: "en-IN" },
          ],
        }} />
      </body>
    </html>
  );
}
