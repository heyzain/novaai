/** Source and designer supplied by the project owner; keep public attribution consistent. */
export const DESIGN_CREDIT = {
  title: "AI Travel Assistant Chatbot Dashboard UI",
  url: "https://dribbble.com/shots/27840684-AI-Travel-Assistant-Chatbot-Dashboard-UI",
  designer: "Sheikh Raihan UI",
  designerUrl: "https://dribbble.com/sheikhraihan1",
  termsUrl: "https://dribbble.com/terms",
  repositoryUrl: "https://github.com/heyzain/novaai",
} as const;

export const ASSET_CREDITS = [
  {
    name: "Reference screenshot",
    source: "Supplied visual reference for the linked Dribbble design.",
    note: "A reuse license or permission record for this image is not documented in the repository.",
    files: ["public/nova-reference.png"],
  },
  {
    name: "Photos & demo portrait",
    source: "Cropped from the supplied reference image.",
    note: "The original photographers and portrait rights holders have not been identified. Cropping an image does not establish reuse rights.",
    files: ["public/images/summer-*.png", "public/avatars/emma-grace.png"],
  },
  {
    name: "Interface icons",
    source: "React/SVG implementations guided by the reference design.",
    note: "Implementation in code does not transfer ownership of the original visual design.",
    files: ["components/ui/icon.tsx"],
  },
  {
    name: "Project logo & app icons",
    source:
      "The logo was supplied separately for this project; app icons derive from that asset.",
    note: "Its original creator and reuse terms have not been documented. No separate ownership or license claim is made here.",
    files: [
      "public/brand/Glossy Blue N Monogram App Icon.png",
      "app/icon.png",
      "app/apple-icon.png",
    ],
  },
] as const;
