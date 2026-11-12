"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";

const LANGS: [string, string, string][] = [
  ["en", "English", "en-IN"], ["hi", "हिन्दी", "hi-IN"], ["bho", "भोजपुरी", "hi-IN"], ["bn", "বাংলা", "bn-IN"], ["ta", "தமிழ்", "ta-IN"],
  ["te", "తెలుగు", "te-IN"], ["mr", "मराठी", "mr-IN"], ["gu", "ગુજરાતી", "gu-IN"], ["kn", "ಕನ್ನಡ", "kn-IN"], ["ml", "മലയാളം", "ml-IN"],
  ["pa", "ਪੰਜਾਬੀ", "pa-IN"], ["ur", "اردو", "ur-IN"], ["ar", "العربية", "ar-SA"], ["es", "Español", "es-ES"], ["fr", "Français", "fr-FR"],
];
const CHIPS = ["What services do you offer?", "How do I start a project?", "How does payment work?", "What is SDGVIEW?"];
type Msg = { role: "user" | "assistant"; content: string };

export default function GurujiWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const [canVoice, setCanVoice] = useState(false);
  const session = useRef("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    session.current = Math.random().toString(36).slice(2, 12);
    setCanVoice(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    try { const l = localStorage.getItem("sw_guruji_lang"); if (l) setLang(l); } catch {}
    setMsgs([{ role: "assistant", content: "Namaste! I’m AI-Guruji 🙏 Ask me about our services, how projects work, or how to get started — in any language you like." }]);
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const bcp = LANGS.find((l) => l[0] === lang)?.[2] || "en-IN";
  function say(t: string) {
    if (!speak || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.slice(0, 400)); u.lang = bcp; window.speechSynthesis.speak(u);
  }
  async function send(q: string) {
    q = q.trim(); if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/guruji", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-10), lang, session: session.current }) });
      const j = await r.json();
      const reply = j.reply || "Sorry, I couldn’t answer that. Please try the Contact page.";
      setMsgs([...next, { role: "assistant", content: reply }]); say(reply);
    } catch { setMsgs([...next, { role: "assistant", content: "Network problem. Please try again or use WhatsApp." }]); }
    setBusy(false);
  }
  function listen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR(); rec.lang = bcp; rec.interimResults = false;
    rec.onstart = () => setListening(true); rec.onend = () => setListening(false); rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => send(e.results[0][0].transcript);
    rec.start();
  }
  const rtl = lang === "ur" || lang === "ar";

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Open AI-Guruji chat" className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-navy py-1.5 pl-1.5 pr-5 text-white shadow-glow ring-2 ring-brand/60 transition hover:scale-105">
          <Image src="/brand/guruji.png" alt="" width={44} height={44} className="rounded-full" />
          <span className="text-sm font-semibold">Ask AI-Guruji</span>
        </button>
      )}
      {open && (
        <div role="dialog" aria-label="AI-Guruji chat" className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[600px] sm:w-[390px] sm:rounded-3xl">
          <div className="dark-mesh flex items-center gap-3 px-4 py-3 text-white">
            <Image src="/brand/guruji.png" alt="" width={40} height={40} className="rounded-full" />
            <div className="min-w-0 flex-1"><p className="font-display font-semibold leading-tight">AI-Guruji</p><p className="text-[11px] text-cyan-200">Multilingual assistant</p></div>
            <select value={lang} onChange={(e) => { setLang(e.target.value); try { localStorage.setItem("sw_guruji_lang", e.target.value); } catch {} }} className="max-w-[96px] rounded-lg border border-white/20 bg-navy px-2 py-1 text-xs" aria-label="Language">
              {LANGS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
            </select>
            <button onClick={() => { setSpeak(!speak); window.speechSynthesis?.cancel(); }} className={`rounded-lg p-1.5 ${speak ? "bg-brand" : "bg-white/10"}`} aria-label="Read answers aloud" aria-pressed={speak}><Icon name="speaker" className="h-4 w-4" /></button>
            <button onClick={() => setOpen(false)} className="rounded-lg bg-white/10 p-1.5" aria-label="Close chat"><Icon name="x" className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-mist p-4" dir={rtl ? "rtl" : "ltr"} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6 ${m.role === "user" ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{m.content}</p>
              </div>
            ))}
            {busy && <p className="text-xs text-slate-400">AI-Guruji is typing…</p>}
            {msgs.length <= 1 && <div className="flex flex-wrap gap-2 pt-1">{CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand hover:text-white">{c}</button>)}</div>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            {canVoice && <button type="button" onClick={listen} className={`rounded-xl p-2.5 ${listening ? "animate-pulse bg-red-500 text-white" : "bg-slate-100 text-navy"}`} aria-label="Speak your question"><Icon name="mic" className="h-5 w-5" /></button>}
            <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Type your question…" className="input !py-2.5" aria-label="Message" dir="auto" />
            <button className="btn-primary !p-2.5" disabled={busy || !text.trim()} aria-label="Send"><Icon name="send" className="h-5 w-5" /></button>
          </form>
          <p className="bg-white pb-2 text-center text-[10px] text-slate-400">AI can make mistakes. Don’t share passwords or bank details.</p>
        </div>
      )}
    </>
  );
}
