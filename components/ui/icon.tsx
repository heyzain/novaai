import type { ReactNode, SVGProps } from "react";

const paths = {
  plus: <path d="M12 5v14M5 12h14" />,
  sidebar: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M10 3v18m0-9h11" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3M15 5a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-3-5" />
    </>
  ),
  settings: (
    <>
      <path d="m9 3 1-1h4l1 3 3 1 3 1v4l-2 2v3l-2 2h-3l-2 3H8l-1-3-3-1-2-3 2-3V8l3-1 2-4Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: (
    <path d="M14 3a9 9 0 1 0 0 18M12 7l-5 5 5 5M7 12h14M14 6a6 6 0 0 0 0 12" />
  ),
  "thumbs-up": (
    <path d="M7 10v11H3V10h4Zm0 0 5-7h1a2 2 0 0 1 2 2l-1 5h5a2 2 0 0 1 2 2l-2 7a3 3 0 0 1-3 2h-5l-4-3" />
  ),
  "thumbs-down": (
    <path d="M7 14V3H3v11h4Zm0 0 5 7h1a2 2 0 0 0 2-2l-1-5h5a2 2 0 0 0 2-2l-2-7a3 3 0 0 0-3-2h-5L7 6" />
  ),
  edit: (
    <>
      <path d="m14 5 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z" />
      <path d="M12 4H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  diagonal: <path d="M6 18 18 6M6 6h12v12" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  down: <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1.7" />
      <rect x="14" y="4" width="6" height="6" rx="1.7" />
      <rect x="4" y="14" width="6" height="6" rx="1.7" />
      <rect x="14" y="14" width="6" height="6" rx="1.7" />
    </>
  ),
  layers: (
    <>
      <path d="m3 8 9-5 9 5-9 5-9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.8 1.8 0 0 1 1.3-3.1H18c3 0 3-3.2 3-4.5A8 8 0 0 0 12 3Z" />
      <path d="M7 9h.01M10 6.5h.01M15 7h.01M6.5 13h.01" strokeWidth="3" />
    </>
  ),
  type: <path d="M4 5h16M12 5v15M8 20h8M4 8V5m16 3V5" />,
  spacing: <path d="M4 4v16M20 4v16M7 12h10m-7-3-3 3 3 3m4-6 3 3-3 3" />,
  square: <rect x="4" y="4" width="16" height="16" rx="5" />,
  book: (
    <path d="M12 5v15M12 5C9 3 5 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-6-1-9 1Z" />
  ),
  chat: <path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2 1-6A8 8 0 1 1 20 11.5Z" />,
  bag: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="4" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2M3 13h18" />
    </>
  ),
  "history-folder": (
    <>
      <path d="M5 9V6.8C5 5.8 5.8 5 6.8 5h3.4l2 3H17a2 2 0 0 1 2 2v1M5 5V4.5C5 3.7 5.7 3 6.5 3H10l1.5 2" />
      <path d="M4.5 11h15a1.5 1.5 0 0 1 1.5 1.8l-1 5.5A3.3 3.3 0 0 1 16.7 21H7.3A3.3 3.3 0 0 1 4 18.3l-1-5.5A1.5 1.5 0 0 1 4.5 11Z" />
    </>
  ),
  "crown-solid": (
    <>
      <path
        d="m2.5 6.5 5 3.5L12 2.5l4.5 7.5 5-3.5-3 12.5h-13l-3-12.5ZM8 14v2h8v-2H8Z"
        fill="currentColor"
        fillRule="evenodd"
        stroke="none"
      />
      <path d="M6 22h12" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12M12 8C6 8 5 5 7 3.5c2-1.5 4 1.5 5 4.5Zm0 0c6 0 7-3 5-4.5-2-1.5-4 1.5-5 4.5Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" />
    </>
  ),
  bulb: (
    <path d="M8 16c0-3-3-3.5-3-7a7 7 0 0 1 14 0c0 3.5-3 4-3 7M8 16h8M9 19h6m-5 3h4" />
  ),
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="3" />
      <path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" />,
  send: (
    <>
      <path d="m21 3-7 18-4-7-7-4L21 3Z" />
      <path d="m10 14 6-6" />
    </>
  ),
  "send-solid": (
    <path
      fill="currentColor"
      stroke="none"
      d="M18.8 2.9 5.2 6.5c-3.5.9-3.9 5.7-.6 7.3l4.1 1.9 1.9 4.1c1.6 3.3 6.4 2.9 7.3-.6l3.6-13.6c.5-1.7-1-3.2-2.7-2.7Z"
    />
  ),
  paperclip: (
    <path
      d="M12 7v8a3 3 0 0 1-6 0V7a5 5 0 0 1 10 0v9a7 7 0 0 1-14 0v-5"
      transform="translate(2 0)"
    />
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
    </>
  ),
  "mic-input": (
    <>
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M3.5 10v2a8.5 7 0 0 0 17 0v-2M12 19v3m-4 0h8" />
    </>
  ),
  "bulb-input": (
    <>
      <path d="M8.5 16c0-2.5-2.5-3-2.5-6a6 6 0 0 1 12 0c0 3-2.5 3.5-2.5 6M8.5 16h7m-6 3h5m-3.5 3h2M12 0v2M3 4l2 2m14-2-2 2M0 11h2m20 0h2" />
    </>
  ),
  attach: <path d="m8 12 6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l8-8" />,
  crown: (
    <>
      <path d="m3 6 5 4 4-7 4 7 5-4-2 12H5L3 6Z" />
      <path d="M6 21h12" />
    </>
  ),
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />,
  heart: <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 8 15 8 15S25 10 20 5Z" />,
  refresh: <path d="M20 8a9 9 0 1 0 1 7M20 3v5h-5" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
