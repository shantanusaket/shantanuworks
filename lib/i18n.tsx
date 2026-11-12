"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const D: Record<string, Record<string, string>> = {
  en: {
    "nav.home": "Home", "nav.services": "Services", "nav.products": "Products", "nav.how": "How We Work", "nav.about": "About", "nav.insights": "Insights", "nav.contact": "Contact",
    "cta.start": "Start a Project", "cta.explore": "Explore Services", "cta.sdgview": "Discover SDGVIEW", "cta.talk": "Talk to us",
    "hero.kicker": "Technology • Data • AI", "hero.tag": "Technology. Data. AI. Delivered.",
    "footer.tag": "Building systems that transform information into insight, intelligence into action, and ideas into measurable impact.",
  },
  hi: {
    "nav.home": "होम", "nav.services": "सेवाएँ", "nav.products": "प्रोडक्ट्स", "nav.how": "हम कैसे काम करते हैं", "nav.about": "हमारे बारे में", "nav.insights": "इनसाइट्स", "nav.contact": "संपर्क",
    "cta.start": "प्रोजेक्ट शुरू करें", "cta.explore": "सेवाएँ देखें", "cta.sdgview": "SDGVIEW देखें", "cta.talk": "हमसे बात करें",
    "hero.kicker": "टेक्नोलॉजी • डेटा • एआई", "hero.tag": "टेक्नोलॉजी. डेटा. एआई. डिलीवर्ड.",
    "footer.tag": "ऐसे सिस्टम जो जानकारी को इनसाइट, इंटेलिजेंस को एक्शन और विचारों को मापने योग्य प्रभाव में बदलते हैं।",
  },
};
const Ctx = createContext<{ lang: string; setLang: (l: string) => void }>({ lang: "en", setLang: () => {} });
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState("en");
  useEffect(() => { try { const l = localStorage.getItem("sw_lang"); if (l && D[l]) set(l); } catch {} }, []);
  const setLang = (l: string) => { set(l); try { localStorage.setItem("sw_lang", l); document.documentElement.lang = l; } catch {} };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
export function T({ k }: { k: string }) { const { lang } = useLang(); return <>{D[lang]?.[k] ?? D.en[k] ?? k}</>; }
