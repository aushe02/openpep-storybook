import React from 'react';
import { ChevRight } from '../atoms/Icons';

export interface WorkspaceHeaderProps {
  crumbs: string[];
  actions?: React.ReactNode;
}

export function WorkspaceHeader({ crumbs, actions }: WorkspaceHeaderProps) {
  return (
    <div className="op-workspace-header">
      <div className="op-crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span className={i === crumbs.length - 1 ? 'current' : ''}>{c}</span>
            {i < crumbs.length - 1 && <ChevRight size={12} className="sep" />}
          </React.Fragment>
        ))}
      </div>
      {actions && <div className="op-workspace-actions">{actions}</div>}
    </div>
  );
}
