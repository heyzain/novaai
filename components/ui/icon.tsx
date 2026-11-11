import type { ReactNode, SVGProps } from "react";

const paths = {
  plus: (
    <>
      <path d="M12 4.2v15.6M4.2 12h15.6" />
    </>
  ),
  sidebar: (
    <>
      <rect x="3" y="2.7" width="18" height="17.7" rx="4.7" />
      <path d="M10.4 3v17.1M10.4 11.55h10.3" />
    </>
  ),
  people: (
    <>
      <path d="M11.1 7.8a3.6 3.6 0 1 1 3.4 2.6c-.8 0-1.6 0-2.3.1M14.5 10.4c3.2 0 5.7 2.6 5.7 5.8v.7" />
      <circle cx="8.8" cy="10.5" r="3.5" />
      <path d="M3.3 20.2v-.5a5.5 5.5 0 0 1 11 0v.5" />
    </>
  ),
  settings: (
    <>
      <path
        d="M10.1 3.2c.2-.8.9-1.3 1.7-1.3h.4c.8 0 1.5.5 1.7 1.3l.4 1.7c.6.2 1.2.6 1.7 1l1.7-.5c.8-.2 1.6.1 2 .8l.2.4c.4.7.3 1.6-.3 2.2L18.3 10c.1.7.1 1.3 0 2l1.3 1.2c.6.6.7 1.5.3 2.2l-.2.4c-.4.7-1.2 1-2 .8L16 16.1c-.5.4-1.1.8-1.7 1l-.4 1.7c-.2.8-.9 1.3-1.7 1.3h-.4c-.8 0-1.5-.5-1.7-1.3l-.4-1.7c-.6-.2-1.2-.6-1.7-1l-1.7.5c-.8.2-1.6-.1-2-.8l-.2-.4c-.4-.7-.3-1.6.3-2.2L5.7 12c-.1-.7-.1-1.3 0-2L4.4 8.8c-.6-.6-.7-1.5-.3-2.2l.2-.4c.4-.7 1.2-1 2-.8l1.7.5c.5-.4 1.1-.8 1.7-1l.4-1.7Z"
        transform="translate(12 12) scale(1.06 1) translate(-12 -11)"
      />
      <circle cx="12" cy="12" r="3.1" />
    </>
  ),
  logout: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17M12.7 7.2 7.9 12l4.8 4.8M8.1 12H20.5" />
    </>
  ),
  "thumbs-up": (
    <>
      <path d="M7.4 10.5c1.2-1.4 2.5-3.6 3.2-5.5.4-1 1.5-1.3 2.2-.5.6.7.5 2 .4 3.1-.1 1.4.9 2.3 2.3 2.3h1.6c2.2 0 3.4 1.7 3 3.9l-.6 2.9c-.4 2-1.9 3.3-4 3.3H9.7c-1 0-1.7-.3-2.3-.8" />
      <rect x="3.1" y="10" width="4.3" height="10" rx="2.1" />
    </>
  ),
  "thumbs-down": (
    <g transform="translate(0 24) scale(1 -1)">
      <>
        <path d="M7.4 10.5c1.2-1.4 2.5-3.6 3.2-5.5.4-1 1.5-1.3 2.2-.5.6.7.5 2 .4 3.1-.1 1.4.9 2.3 2.3 2.3h1.6c2.2 0 3.4 1.7 3 3.9l-.6 2.9c-.4 2-1.9 3.3-4 3.3H9.7c-1 0-1.7-.3-2.3-.8" />
        <rect x="3.1" y="10" width="4.3" height="10" rx="2.1" />
      </>
    </g>
  ),
  edit: (
    <>
      <path d="M19.75 11.7v5.5a2.6 2.6 0 0 1-2.6 2.6H6.65a2.6 2.6 0 0 1-2.6-2.6V6.7a2.6 2.6 0 0 1 2.6-2.6h5.5" />
      <path d="m12 13.75 7.35-7.35a2.05 2.05 0 0 0-2.9-2.9L9.1 10.85l-.9 3.75 3.8-.85Z" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  diagonal: <path d="M6 18 18 6M6 6h12v12" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  down: <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="10.9" cy="10.9" r="7.4" />
      <path d="m16.2 16.2 4.1 4.1" />
    </>
  ),
  grid: (
    <>
      <rect x="3.6" y="3.6" width="7" height="7" rx="2.25" />
      <rect x="13.4" y="3.6" width="7" height="7" rx="2.25" />
      <rect x="3.6" y="13.4" width="7" height="7" rx="2.25" />
      <rect x="13.4" y="13.4" width="7" height="7" rx="2.25" />
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
      <path d="M5.2 10V7.6c0-1.25 1-2.25 2.25-2.25h8.9c1.25 0 2.25 1 2.25 2.25V10M6 5.35V4.3c0-.75.6-1.35 1.35-1.35H10l1.8 2.4" />
      <path d="M4.4 10h15.2c1.1 0 1.8 1 1.55 2.05l-1.25 6.2a2.9 2.9 0 0 1-2.8 2.35H6.9a2.9 2.9 0 0 1-2.8-2.35l-1.25-6.2C2.6 11 3.3 10 4.4 10Z" />
    </>
  ),
  "crown-solid": (
    <>
      <path
        d="m1.9 5.9 5.3 3.6L12 1.7l4.8 7.8 5.3-3.6L18.5 19h-13L1.9 5.9ZM8.4 13.5v1.8h7.2v-1.8H8.4Z"
        fill="currentColor"
        fillRule="evenodd"
        stroke="none"
      />
      <path d="M6.5 21.5h11" />
    </>
  ),
  gift: (
    <>
      <rect x="4.3" y="10" width="15.4" height="10.4" rx="2.1" />
      <path d="M3.5 7.2h17v4H3.5zM12 7.3v13M11.95 7c-2.8 0-5.65-.5-5.65-2.65 0-1.45 1.75-2.2 3.15-1.3 1.52.97 2.5 3.95 2.5 3.95ZM12.05 7c2.8 0 5.65-.5 5.65-2.65 0-1.45-1.75-2.2-3.15-1.3-1.52.97-2.5 3.95-2.5 3.95Z" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M5.2 6.6c.7 2.3 2.5 3.5 4.3 2.2l2.4-1.9c1.2-.9 1.3-2.1.9-3.6M20.5 11.2h-4c-2.6 0-4.6 1.8-4.6 4.2v4.9" />
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
  code: (
    <>
      <path d="m8.1 8-4.6 4 4.6 4M15.9 8l4.6 4-4.6 4M14 5.7l-4 12.6" />
    </>
  ),
  copy: (
    <>
      <rect x="8.35" y="8.35" width="12.2" height="12.2" rx="2.55" />
      <path d="M15.35 8.3v-2.1a2.7 2.7 0 0 0-2.7-2.7H6.3a2.8 2.8 0 0 0-2.8 2.8v6.25a2.7 2.7 0 0 0 2.7 2.7h2.1" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  download: (
    <>
      <path d="M12 3.3v12.1M7.4 10.85 12 15.45l4.6-4.6M4.2 17.15v1.55a2.25 2.25 0 0 0 2.25 2.25h11.1a2.25 2.25 0 0 0 2.25-2.25v-1.55" />
    </>
  ),
  send: (
    <>
      <path d="m21 3-7 18-4-7-7-4L21 3Z" />
      <path d="m10 14 6-6" />
    </>
  ),
  "send-solid": (
    <path
      d="M17.5 2.9c2.3-.5 3.7.9 3.1 3.2l-3.4 11.3c-.5 2-1.7 3.3-3.5 3.4-2.6.2-4.2-1.4-4.4-4.1l-.2-3.2-2 .1c-2.7.1-4.5-1.4-4.5-3.8 0-1.9 1.2-3.4 3.3-3.9l11.6-3Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  paperclip: (
    <path d="M19.7 12v2.5a7.2 6.3 0 0 1-14.4 0V8.2a5 4.6 0 0 1 10 0v6.3a3 2.8 0 0 1-6 0V8.3" />
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
    </>
  ),
  "mic-input": (
    <>
      <rect x="7.3" y="1.6" width="9.4" height="14" rx="4.7" />
      <path d="M3.6 10.2v2a8.4 7.8 0 0 0 16.8 0v-2M12 20v2.5M8.1 22.5h7.8" />
    </>
  ),
  "bulb-input": (
    <>
      <path d="M8.8 16.3c-.6-1.5-2.9-2.7-2.9-5.6a6.1 6.1 0 0 1 12.2 0c0 2.9-2.3 4.1-2.9 5.6l-.7 2.2h-5l-.7-2.2ZM9.1 15h5.8L12 19.5 9.1 15ZM10.5 21h3M12 1.5v1M4.8 4.7l.8.8M18.4 5.5l.8-.8M2.3 10.5h1M20.7 10.5h1" />
    </>
  ),
  attach: <path d="m8 12 6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l8-8" />,
  crown: (
    <>
      <path d="m3 6 5 4 4-7 4 7 5-4-2 12H5L3 6Z" />
      <path d="M6 21h12" />
    </>
  ),
  trash: (
    <>
      <path d="M2.7 6.2h18.6M8.1 6V3.6c0-.6.5-1.1 1.1-1.1h5.6c.6 0 1.1.5 1.1 1.1V6M4.8 6.7l1 13.1c.1 1.1.8 1.7 1.9 1.7h8.6c1.1 0 1.8-.6 1.9-1.7l1-13.1M9.3 10v7.8M14.7 10v7.8" />
    </>
  ),
  heart: <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 8 15 8 15S25 10 20 5Z" />,
  refresh: (
    <>
      <path d="M20.2 11a8.15 8.15 0 0 0-14.4-4.82L3.8 8.55M3.8 4.8v3.85h3.9" />
      <path d="M3.8 13a8.15 8.15 0 0 0 14.4 4.82l2-2.37M20.2 19.2v-3.85h-3.9" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.45" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.45" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.45" fill="currentColor" stroke="none" />
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
  title,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number | string;
  title?: string;
}) {
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
      aria-hidden={
        title || props["aria-label"] || props["aria-labelledby"]
          ? undefined
          : true
      }
      aria-label={title}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
