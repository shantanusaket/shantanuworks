export const SITE = {
  name: "ShantanuWorks",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shantanuworks.com").replace(/\/$/, ""),
  slogan: "Ideas. Engineered for Impact.",
  descriptor: "Engineering Digital Intelligence",
  pillars: "Technology • Data • AI",
  phone: process.env.NEXT_PUBLIC_PHONE || "+918210328847",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "918210328847",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sdgviewads@gmail.com",
  sdgview: process.env.NEXT_PUBLIC_SDGVIEW_URL || "https://www.sdgview.com",
  description:
    "ShantanuWorks designs, builds and scales intelligent digital systems — data dashboards, AI assistants, automation and modern web platforms — that turn ideas into measurable impact.",
};
export const waLink = (text = "Hello ShantanuWorks, I would like to discuss a project.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
