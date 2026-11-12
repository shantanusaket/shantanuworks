const P: Record<string, string> = {
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  brain: "M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4a1 1 0 0 0-3-1Zm6 0a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1V4a1 1 0 0 1 3-1Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9ZM3 12h18",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.2-1.3L14.3 3h-4l-.4 2.4A7 7 0 0 0 7.7 6.7l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z",
  doc: "M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6M10 17h6",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2 5-5 2 2-5 5-2Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  check: "m5 12 5 5 9-10",
  menu: "M4 7h16M4 12h16M4 17h16",
  x: "M6 6l12 12M18 6 6 18",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-6-3a6 6 0 0 0 12 0M12 18v3",
  send: "M4 12 20 4l-4 16-4-7-8-1Z",
  speaker: "M4 9v6h4l5 4V5L8 9H4Zm12 0a4 4 0 0 1 0 6",
  whatsapp: "M20 12a8 8 0 0 1-12 7l-4 1 1-4a8 8 0 1 1 15-4Z",
  lock: "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5V11Z",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.2L12 17l-5.4 3 1-6.2L3.2 9.5l6.1-.9L12 3Z",
};
export default function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={P[name] || P.chart} />
    </svg>
  );
}
