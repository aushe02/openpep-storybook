import React from 'react';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'default' | 'sm' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({ variant = 'default', size = 'default', className = '', children, ...props }: ButtonProps) {
  const classes = [
    'op-btn',
    variant === 'primary' ? 'op-btn-primary' : '',
    variant === 'ghost' ? 'op-btn-ghost' : '',
    variant === 'danger' ? 'op-btn-danger' : '',
    size === 'sm' ? 'op-btn-sm' : '',
    size === 'icon' ? 'op-btn-icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
