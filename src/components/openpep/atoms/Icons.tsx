import React from 'react';

interface IconProps {
  size?: number;
  sw?: number;
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon = ({ d, size = 16, sw = 1.75, fill = 'none', className, style }: IconProps & { d: string | string[] }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const Beaker = (p: IconProps) => <Icon {...p} d={['M9 3h6', 'M10 3v6.5L4.5 19A2 2 0 0 0 6.3 22h11.4a2 2 0 0 0 1.8-2.9L14 9.5V3', 'M7.5 14h9']} />;
export const Book = (p: IconProps) => <Icon {...p} d={['M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20']} />;
export const GitBranch = (p: IconProps) => <Icon {...p} d={['M6 3v12', 'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 9a9 9 0 0 1-9 9']} />;
export const Compare = (p: IconProps) => <Icon {...p} d={['M12 3v18', 'M5 8l-3 4 3 4', 'M19 8l3 4-3 4', 'M2 12h6', 'M16 12h6']} />;
export const Import = (p: IconProps) => <Icon {...p} d={['M12 3v12', 'M7 10l5 5 5-5', 'M5 21h14']} />;
export const Settings = (p: IconProps) => <Icon {...p} d={['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z']} />;
export const Search = (p: IconProps) => <Icon {...p} d={['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.35-4.35']} />;
export const Plus = (p: IconProps) => <Icon {...p} d={['M12 5v14', 'M5 12h14']} />;
export const ChevDown = (p: IconProps) => <Icon {...p} d="M6 9l6 6 6-6" />;
export const ChevRight = (p: IconProps) => <Icon {...p} d="M9 6l6 6-6 6" />;
export const ChevLeft = (p: IconProps) => <Icon {...p} d="M15 6l-6 6 6 6" />;
export const Trash = (p: IconProps) => <Icon {...p} d={['M3 6h18', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6', 'M10 11v6', 'M14 11v6']} />;
export const Copy = (p: IconProps) => <Icon {...p} d={['M9 9h11v11H9z', 'M5 15V5a2 2 0 0 1 2-2h10']} />;
export const Save = (p: IconProps) => <Icon {...p} d={['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8']} />;
export const Play = (p: IconProps) => <Icon {...p} d="M5 3l16 9-16 9z" fill="currentColor" />;
export const Tag = (p: IconProps) => <Icon {...p} d={['M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z', 'M7 7h.01']} />;
export const Check = (p: IconProps) => <Icon {...p} d="M5 13l4 4L19 7" />;
export const X = (p: IconProps) => <Icon {...p} d={['M18 6L6 18', 'M6 6l12 12']} />;
export const Filter = (p: IconProps) => <Icon {...p} d="M3 5h18l-7 9v6l-4-2v-4z" />;
export const Export = (p: IconProps) => <Icon {...p} d={['M12 15V3', 'M7 8l5-5 5 5', 'M5 21h14']} />;
export const File = (p: IconProps) => <Icon {...p} d={['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6']} />;
export const Folder = (p: IconProps) => <Icon {...p} d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />;
export const Clock = (p: IconProps) => <Icon {...p} d={['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2']} />;
export const Sparkles = (p: IconProps) => <Icon {...p} d={['M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z', 'M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z']} />;
export const Flame = (p: IconProps) => <Icon {...p} d="M12 22a7 7 0 0 0 7-7c0-2.5-2-5.5-7-13C7 9.5 5 12.5 5 15a7 7 0 0 0 7 7zm0-4a3 3 0 0 1-3-3c0-1 1-2.5 3-5 2 2.5 3 4 3 5a3 3 0 0 1-3 3z" />;
export const Eye = (p: IconProps) => <Icon {...p} d={['M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z']} />;
export const ArrowRight = (p: IconProps) => <Icon {...p} d={['M5 12h14', 'M13 6l6 6-6 6']} />;
export const Download = (p: IconProps) => <Icon {...p} d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']} />;
export const Upload = (p: IconProps) => <Icon {...p} d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12']} />;
export const ArrowUp = (p: IconProps) => <Icon {...p} d={['M12 19V5', 'M5 12l7-7 7 7']} />;
export const ArrowDown = (p: IconProps) => <Icon {...p} d={['M12 5v14', 'M19 12l-7 7-7-7']} />;
export const Minus = (p: IconProps) => <Icon {...p} d="M5 12h14" />;
export const Lock = (p: IconProps) => <Icon {...p} d={['M5 11h14v10H5z', 'M8 11V7a4 4 0 1 1 8 0v4']} />;

export const Icons = {
  Beaker, Book, GitBranch, Compare, Import, Settings, Search, Plus,
  ChevDown, ChevRight, ChevLeft, Trash, Copy, Save, Play, Tag, Check, X,
  Filter, Export, File, Folder, Clock, Sparkles, Flame, Eye, ArrowRight,
  Download, Upload, ArrowUp, ArrowDown, Minus, Lock,
};

export type IconName = keyof typeof Icons;
