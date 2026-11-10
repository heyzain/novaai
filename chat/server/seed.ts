import "server-only";
import type { Conversation, Profile } from "../contracts";

export const profile: Profile = {
  name: "Emma Grace",
  plan: "Free",
  avatarSrc: "/avatars/emma-grace.png",
};
export const mountainReply =
  "Absolutely! I can suggest several ready-made mountain tours, ranging from\nrelaxing scenic trips to more active hiking experiences. Let me know your preferred\ndates and activity level, and I'll find the best options for you.";
export const recentIds = [
  "mountains",
  "discover",
  "itinerary",
  "personal",
  "journey",
  "hiking",
];
export const historyIds = [
  "mountains",
  "query",
  "dashboard",
  "process",
  "cta",
  "form",
];

const history = [
  {
    id: "query",
    title: "How can I optimize this query?",
    description: "I need to optimize this query for better performance.",
  },
  {
    id: "dashboard",
    title: "How can I improve the dashboard?",
    description: "Analyze this screen and tell me what to improve.",
  },
  {
    id: "process",
    title: "How can I simplify this process?",
    description: "I need to simplify this process for my team.",
  },
  {
    id: "cta",
    title: "Suggest a CTA for a business website",
    description: "Several call-to-action options for my business.",
  },
  {
    id: "form",
    title: "Improve form UX",
    description: "Users are dropping off on this form.",
  },
];
const travel = [
  { id: "discover", title: "Discover Hidden Gems Around the World" },
  { id: "itinerary", title: "Build Perfect Itineraries In Just Minutes" },
  { id: "personal", title: "Travel Smarter With Personalized Plans" },
  { id: "journey", title: "Navigate Every Journey With Confidence" },
  { id: "hiking", title: "Create Hiking Adventures Tailored To You" },
];

/** Read-only fixtures; requests never mutate shared state or another visitor's session. */
export const conversations: Conversation[] = [
  {
    id: "mountains",
    title: "Mountains in the summer",
    navigationTitle: "Smart Travel Planning Made Easy",
    description: "What can you see in the mountains?",
    messages: [
      {
        id: "welcome",
        role: "assistant",
        text: "Hi! Summer in the mountains is especially beautiful — green valleys, lakes, and fresh air. For example, this is what a typical mountain lake looks like in summer 🌞",
        images: [
          {
            src: "/images/summer-lake-sailing.png",
            alt: "A sailboat on a summer mountain lake",
          },
          {
            src: "/images/summer-alpine-lake.png",
            alt: "An alpine lake beneath snow-covered peaks",
          },
          {
            src: "/images/summer-turquoise-lake.png",
            alt: "A turquoise mountain lake framed by pine trees",
          },
        ],
      },
      {
        id: "mountain-question",
        role: "user",
        text: "It looks really beautiful! Could you please find some ready-made mountain tours?",
      },
      { id: "mountain-reply", role: "assistant", text: mountainReply },
    ],
  },
  ...history.map(
    (item): Conversation => ({
      ...item,
      messages: [
        { id: `${item.id}-question`, role: "user", text: item.description },
        {
          id: `${item.id}-reply`,
          role: "assistant",
          text: "Let’s take a closer look. Share a few more details about what you’d like to improve, and we can work through it together.",
        },
      ],
    }),
  ),
  ...travel.map(
    (item): Conversation => ({
      ...item,
      description: "Your next adventure starts with a little curiosity.",
      messages: [
        {
          id: `${item.id}-welcome`,
          role: "assistant",
          text: "Where would you like to go next? Tell me what you have in mind, from a peaceful mountain escape to a whole new adventure.",
        },
      ],
    }),
  ),
];
