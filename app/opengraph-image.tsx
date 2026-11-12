import { ImageResponse } from "next/og";
export const alt = "ShantanuWorks – Ideas. Engineered for Impact.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, color: "white", background: "linear-gradient(135deg,#0F172A 0%,#13203f 55%,#1d4ed8 140%)" }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#22d3ee", display: "flex" }}>TECHNOLOGY • DATA • AI</div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 24, display: "flex" }}>SHANTANU<span style={{ color: "#3b82f6" }}>WORKS</span></div>
        <div style={{ fontSize: 44, marginTop: 20, color: "#cbd5e1", display: "flex" }}>Ideas. Engineered for Impact.</div>
        <div style={{ fontSize: 28, marginTop: 36, color: "#94a3b8", display: "flex" }}>Engineering Digital Intelligence · Flagship product: SDGVIEW</div>
      </div>
    ),
    size
  );
}
