/* ===== CHANGE THESE THREE VALUES BEFORE LAUNCH ===== */
const CONFIG = {
  email: "CHANGE-ME@example.com",     // where inquiries are sent (fallback when no endpoint)
  whatsapp: "91XXXXXXXXXX",           // digits only with country code; button hidden while it contains XXXX
  endpoint: ""                        // optional: POST JSON here (e.g. your /api/leads). Empty = open email app
};
/* =================================================== */

document.documentElement.classList.add("js");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero headline: one orchestrated word-by-word entrance
const h1 = document.querySelector(".hero h1");
if (h1 && !reduce) {
  h1.setAttribute("aria-label", h1.textContent);
  h1.innerHTML = h1.textContent.trim().split(/\s+/)
    .map((w, i) => `<span class="wd" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join("");
}

// Hero blobs drift toward the pointer
const hero = document.querySelector(".hero");
if (hero && !reduce) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
}

// Reveal on scroll
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".r").forEach((el) => io.observe(el));

// Process line fills as you scroll
const tl = document.querySelector(".tl");
if (tl) {
  const upd = () => {
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    tl.style.setProperty("--p", p.toFixed(3));
  };
  addEventListener("scroll", upd, { passive: true }); upd();
}

// Mobile menu
const mb = document.querySelector(".mb"), nav = document.querySelector("nav");
if (mb) {
  mb.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", open);
  });
}

// WhatsApp button (only when a real number is set)
if (!CONFIG.whatsapp.includes("X")) {
  const a = document.createElement("a");
  a.className = "wa"; a.textContent = "WhatsApp"; a.target = "_blank"; a.rel = "noopener";
  a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hello ShantanuWorks, I'd like to discuss a project.");
  document.body.appendChild(a);
}

// Contact form
const f = document.getElementById("form"), fm = document.getElementById("fm");
if (f) {
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    if (d.website) return; // honeypot: bots only
    if (!d.name?.trim() || !/^\S+@\S+\.\S+$/.test(d.email || "")) {
      fm.textContent = "Please enter your name and a valid email address.";
      return;
    }
    if (CONFIG.endpoint) {
      try {
        const r = await fetch(CONFIG.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
        if (!r.ok) throw new Error();
        fm.textContent = "Thank you. We have received your inquiry and will review it personally.";
        f.reset();
      } catch { fm.textContent = "Could not send. Please try again or message us on WhatsApp."; }
    } else {
      const body = Object.entries(d).filter(([k]) => k !== "website").map(([k, v]) => k + ": " + v).join("\n");
      location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Project inquiry: " + d.type) + "&body=" + encodeURIComponent(body);
      fm.textContent = "Your email app should open with the details ready to send.";
    }
  });
}
