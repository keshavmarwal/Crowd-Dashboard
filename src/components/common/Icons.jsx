const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v10h13V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
);
export const EntriesIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M16 8 8 16" />
    <path d="M8 11v5h5" />
    <path d="M13 8h3v3" />
  </svg>
);
export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const PinIcon = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
  </svg>
);
export const ChevronDown = (p) => (
  <svg {...base} width={20} height={20} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ChevronLeft = (p) => (
  <svg {...base} width={20} height={20} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ChevronRight = (p) => (
  <svg {...base} width={20} height={20} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const BellIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);
export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);
export const LogoutIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M10 8 6 12l4 4M6 12h10" />
  </svg>
);
export const TrendUp = (p) => (
  <svg {...base} width={24} height={16} viewBox="0 0 24 16" {...p}>
    <path d="M1 14 7 8l4 4L21 2" />
    <path d="M15 2h6v6" />
  </svg>
);
export const TrendDown = (p) => (
  <svg {...base} width={24} height={16} viewBox="0 0 24 16" {...p}>
    <path d="M1 2l6 6 4-4 10 10" />
    <path d="M15 14h6V8" />
  </svg>
);
export const PersonIcon = ({ female, ...p }) => (
  <svg width="22" height="34" viewBox="0 0 22 34" fill="currentColor" aria-hidden="true" {...p}>
    <circle cx="11" cy="4.5" r="3.8" />
    {female ? (
      <path d="M11 10c-3 0-5 2-5.5 5L3 25h4l1 8h6l1-8h4l-2.500-10C16 12 14 10 11 10Z" />
    ) : (
      <path d="M5 11h12a2 2 0 0 1 2 2v9h-3v11h-4.500V23h-1v10H6V22H3v-9a2 2 0 0 1 2-2Z" />
    )}
  </svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
