import React from "react";

export interface HandDrawnIconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Signature Eye Logo for BoardLogic
export const EyeLogo: React.FC<HandDrawnIconProps> = ({ className = "", size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="20" cy="20" r="18" fill="#F1F5F9" stroke="#0F172A" strokeWidth="2.5" />
    <circle cx="20" cy="20" r="12" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" strokeDasharray="3 2" />
    <circle cx="20" cy="20" r="6" fill="#0F172A" />
    <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
  </svg>
);

// Database Cylinder Doodle (Matching reference screenshots 1 & 2)
export const DoodleDatabase: React.FC<HandDrawnIconProps> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <ellipse cx="20" cy="10" rx="14" ry="5" fill="#60A5FA" stroke="#0F172A" strokeWidth="2.2" />
    <path d="M6 10V20C6 22.8 12.3 25 20 25C27.7 25 34 22.8 34 20V10" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.2" />
    <path d="M6 20V30C6 32.8 12.3 35 20 35C27.7 35 34 32.8 34 30V20" fill="#2563EB" stroke="#0F172A" strokeWidth="2.2" />
    <circle cx="20" cy="17.5" r="2.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
    <path d="M20 26.5V29.5M18.5 28H21.5" stroke="#BBF7D0" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Server Rack Doodle with Purple Drawers (Matching reference screenshot 2)
export const DoodleServer: React.FC<HandDrawnIconProps> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="8" y="6" width="24" height="28" rx="3" fill="#60A5FA" stroke="#0F172A" strokeWidth="2.2" />
    <rect x="11" y="9" width="18" height="5" rx="1.5" fill="#C084FC" stroke="#0F172A" strokeWidth="1.8" />
    <circle cx="26" cy="11.5" r="1" fill="#FACC15" />
    <rect x="11" y="17" width="18" height="5" rx="1.5" fill="#C084FC" stroke="#0F172A" strokeWidth="1.8" />
    <rect x="11" y="25" width="18" height="5" rx="1.5" fill="#C084FC" stroke="#0F172A" strokeWidth="1.8" />
  </svg>
);

// Blockchain 3D Cubes Doodle (Matching reference screenshot 1)
export const DoodleBlockchainCubes: React.FC<HandDrawnIconProps> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="6" y="8" width="12" height="12" rx="2" fill="#60A5FA" stroke="#0F172A" strokeWidth="2" />
    <rect x="22" y="8" width="12" height="12" rx="2" fill="#60A5FA" stroke="#0F172A" strokeWidth="2" />
    <rect x="14" y="20" width="12" height="12" rx="2" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
    <path d="M18 14H22M12 20V26M28 20V26" stroke="#0F172A" strokeWidth="2" strokeDasharray="2 2" />
    <circle cx="12" cy="14" r="1.5" fill="#FACC15" />
    <circle cx="28" cy="14" r="1.5" fill="#FACC15" />
    <circle cx="20" cy="26" r="1.5" fill="#FACC15" />
  </svg>
);

// Microchip / WA Doodle (Matching reference screenshot 1)
export const DoodleChip: React.FC<HandDrawnIconProps> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
    <rect x="10" y="10" width="20" height="20" rx="3" fill="#C084FC" stroke="#0F172A" strokeWidth="2.2" />
    <path d="M6 15H10M6 20H10M6 25H10M30 15H34M30 20H34M30 25H34M15 6V10M20 6V10M25 6V10M15 30V34M20 30V34M25 30V34" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <text x="13" y="24" fontFamily="sans-serif" fontWeight="bold" fontSize="9" fill="#0F172A">WA</text>
  </svg>
);

// Hand-Drawn Doodle Rocket
export const DoodleRocket: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path
      d="M16 3C22 3 25 10 25 17L16 23L7 17C7 10 10 3 16 3Z"
      fill="#60A5FA"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="11" r="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
    <path d="M7 17L3 21L7 22L7 17Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
    <path d="M25 17L29 21L25 22L25 17Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
    <path d="M12 23L16 29L20 23" fill="#EF4444" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// Hand-Drawn Doodle Brain
export const DoodleBrain: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path
      d="M8 12C5 12 4 16 6 19C4 22 7 25 11 25C13 27 19 27 21 25C25 25 28 22 26 19C28 16 27 12 24 12C24 8 19 6 16 8C13 6 8 8 8 12Z"
      fill="#F97316"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

// Hand-Drawn Doodle Bar Chart
export const DoodleChart: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="4" y="18" width="6" height="10" rx="1.5" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
    <rect x="13" y="12" width="6" height="16" rx="1.5" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
    <rect x="22" y="6" width="6" height="22" rx="1.5" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
    <path d="M2 28H30" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Hand-Drawn Doodle Globe
export const DoodleGlobe: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="12" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.2" />
    <path d="M4 16H28" stroke="#0F172A" strokeWidth="1.8" />
    <ellipse cx="16" cy="16" rx="6" ry="12" fill="none" stroke="#0F172A" strokeWidth="1.8" />
  </svg>
);

// Hand-Drawn Doodle Lock
export const DoodleLock: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="6" y="14" width="20" height="14" rx="3" fill="#60A5FA" stroke="#0F172A" strokeWidth="2.2" />
    <path d="M10 14V9C10 5.68629 12.6863 3 16 3C19.3137 3 22 5.68629 22 9V14" stroke="#0F172A" strokeWidth="2.2" fill="none" />
  </svg>
);

// Hand-Drawn Doodle Shield
export const DoodleShield: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 3L27 7V16C27 22.5 22 27.5 16 29C10 27.5 5 22.5 5 16V7L16 3Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.2" strokeLinejoin="round" />
  </svg>
);

// Hand-Drawn Doodle Clock
export const DoodleClock: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="12" fill="#FACC15" stroke="#0F172A" strokeWidth="2.2" />
    <path d="M16 8V16L21 19" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Hand-Drawn Doodle Wallet
export const DoodleWallet: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="4" y="8" width="24" height="18" rx="3" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.2" />
  </svg>
);

// Hand-Drawn Doodle Network
export const DoodleNetwork: React.FC<HandDrawnIconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="8" r="4" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
    <circle cx="8" cy="22" r="4" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
    <circle cx="24" cy="22" r="4" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
  </svg>
);

export const ALL_DOODLE_ICONS = [
  { Component: DoodleBlockchainCubes, label: "blockchain" },
  { Component: DoodleDatabase, label: "database" },
  { Component: DoodleServer, label: "server" },
  { Component: DoodleChip, label: "chip" },
  { Component: DoodleRocket, label: "rocket" },
  { Component: DoodleBrain, label: "brain" },
  { Component: DoodleChart, label: "chart" },
  { Component: DoodleGlobe, label: "globe" },
  { Component: DoodleLock, label: "lock" },
  { Component: DoodleShield, label: "shield" },
  { Component: DoodleClock, label: "clock" },
  { Component: DoodleWallet, label: "wallet" },
  { Component: DoodleNetwork, label: "network" },
];
