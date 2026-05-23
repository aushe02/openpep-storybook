import React from 'react';
import { Check } from '../atoms/Icons';

export interface TitlebarProps {
  title: string;
  savedAt?: Date | null;
}

function timeAgo(t: Date): string {
  const s = Math.floor((Date.now() - t.getTime()) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function Titlebar({ title, savedAt }: TitlebarProps) {
  return (
    <div className="op-titlebar">
      <div className="op-titlebar-traffic">
        <span /><span /><span />
      </div>
      <div className="op-titlebar-title">{title}</div>
      <div className="op-titlebar-spacer" />
      {savedAt && (
        <div className="op-titlebar-saved">
          <Check size={11} /> saved · {timeAgo(savedAt)}
        </div>
      )}
    </div>
  );
}
